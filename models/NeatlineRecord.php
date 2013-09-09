<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Neatline_Row_Expandable
    implements Zend_Acl_Resource_Interface
{

    public $owner_id = 0;
    public $item_id;
    public $exhibit_id;
    public $added;
    public $modified;
    public $is_coverage = 0;
    public $is_wms = 0;
    public $slug;
    public $title;
    public $body;
    public $coverage;
    public $tags;
    public $widgets;
    public $presenter = 'StaticBubble';
    public $fill_color = '#00aeff';
    public $fill_color_select = '#00aeff';
    public $stroke_color = '#000000';
    public $stroke_color_select = '#000000';
    public $fill_opacity = 0.3;
    public $fill_opacity_select = 0.4;
    public $stroke_opacity = 0.9;
    public $stroke_opacity_select = 1.0;
    public $stroke_width = 2;
    public $point_radius = 10;
    public $zindex;
    public $weight;
    public $start_date;
    public $end_date;
    public $after_date;
    public $before_date;
    public $point_image;
    public $wms_address;
    public $wms_layers;
    public $min_zoom;
    public $max_zoom;
    public $map_zoom;
    public $map_focus;


    /**
     * Set exhibit and item references.
     *
     * @param NeatlineExhibit $exhibit The exhibit record.
     * @param Item $item The item record.
     */
    public function __construct($exhibit=null, $item=null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
        if (!is_null($item)) $this->item_id = $item->id;
    }


    /**
     * Get the parent exhibit record.
     *
     * @return NeatlineExhibit The parent exhibit.
     */
    public function getExhibit()
    {
        return get_record_by_id('NeatlineExhibit', $this->exhibit_id);
    }


    /**
     * Get the parent item record.
     *
     * @return Item The parent item.
     */
    public function getItem()
    {
        return get_record_by_id('Item', $this->item_id);
    }


    /**
     * Save data from a POST or PUT request.
     *
     * @param array $values The POST/PUT values.
     */
    public function saveForm($values)
    {

        // Cache the original tags string.
        $oldTags = nl_explode($this->tags);

        // Mass-assign the form.
        $this->setArray($values);

        // If 1 or more tags have been added to the record since the last
        // time it was saved, pull in the _existing_ CSS rules for those
        // tags onto the record before using the record to update the CSS.
        // Otherwise, the existing styles set for the tag(s) in the CSS
        // and on other records with the tag(s) would be clobbered in the
        // next step by the current values on the record being saved.
        // The intuition here is that act of adding a new tag to a record
        // should have the effect of making the record _conform_ to the
        // already-established styling of other records with that tag -
        // instead of changing the other records to look like this record.
        $newTags = nl_explode($this->tags);
        $this->pullStyles(array_diff($newTags, $oldTags));
        $this->save();

        // For each of the tags defined on the record, update the rule-set
        // for that tag in the exhibit CSS (if one exists) with the values
        // defined on the record.
        $exhibit = $this->getExhibit();
        $exhibit->pullStyles($this);
        $exhibit->save();

        // Once the exhibit CSS has been updated with the record values,
        // propagate the new rules to all other records in the exhibit.
        $exhibit->pushStyles();

    }


    /**
     * Before saving, replace the raw value of `coverage` with the MySQL
     * expression to set the `GEOMETRY` value. If `coverage` is undefined,
     * use `POINT(0 0)` as a de facto "null" value (ignored in queries).
     *
     * @return array An array representation of the record.
     */
    public function toArrayForSave()
    {

        $fields = parent::toArrayForSave();

        // Set the `is_coverage` tracker.
        $fields['is_coverage'] = !is_null($fields['coverage']) ? 1 : 0;

        // Add the coverage.
        $fields['coverage'] = new Zend_Db_Expr("COALESCE(
            GeomFromText('{$fields['coverage']}'),
            GeomFromText('POINT(0 0)')
        )");

        return $fields;

    }


    /**
     * Update record styles to match exhibit CSS. For example, if `styles`
     * on the parent exhibit is:
     *
     * .tag1 {
     *   fill-color: #111111;
     * }
     * .tag2 {
     *   stroke-color: #222222;
     * }
     *
     * And `array('tag1', 'tag2')` is passed, `fill_color` should be set
     * to '#111111' and `stroke_color` to '#222222'.
     *
     * @param array $tags An array of tags to pull.
     */
    public function pullStyles($tags)
    {

        // If the record is new, pull the `all` tag.
        if (!$this->exists()) {
            $tags = array_merge($tags, array('all'));
        }

        // Parse the stylesheet.
        $css = nl_readCSS($this->getExhibit()->styles);

        // Gather style columns.
        $valid = nl_getStyles();

        // Walk CSS rules.
        foreach ($css as $selector => $rules) {

            // If the tag is being pulled.
            if (in_array($selector, $tags)) {

                // Walk valid CSS rules.
                foreach ($rules as $prop => $val) {

                    // Is the property valid?
                    if (in_array($prop, $valid)) {

                        // Set value if not `auto` or `none`.
                        if ($val != 'auto' && $val != 'none') {
                            $this->$prop = $val;
                        }

                        // If `none`, set NULL.
                        else if ($val == 'none') {
                            $this->$prop = null;
                        }

                    }

                }

            }

        }

    }


    /**
     * If the record has a defined WMS address and layer, ensure that the
     * record will always be matched by viewport queries by overriding the
     * coverage with a special geometry that will _always_ intersect the
     * viewport - four points, one in each quadrant, with arbitrarily high
     * values, effectively outlining a rectangle over the entire map.
     */
    public function compileWms()
    {

        // If a WMS address and layer are defined.
        if ($this->wms_address && $this->wms_layers) {

            // Set the special coverage.
            $this->coverage = 'GEOMETRYCOLLECTION(
                POINT( 9999999  9999999),
                POINT(-9999999  9999999),
                POINT(-9999999 -9999999),
                POINT( 9999999 -9999999)
            )';

            $this->is_coverage = 1;
            $this->is_wms = 1;

        }

    }


    /**
     * Compile the Omeka item reference, if one exists.
     */
    public function compileItem()
    {

        // Get parent item.
        $item = $this->getItem();
        if (!$item) return;

        // Set title and body.
        $this->title = metadata($item, array('Dublin Core', 'Title'));
        $this->body  = nl_getItemMarkup($this);

    }

    /**
     * This imports any data from NeatlineFeatures, if it's installed.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function importNeatlineFeatures()
    {
        if (!$this->coverage) {
            $geo = nl_getNeatlineFeatures($this);
            if (!is_null($geo)) {
                $this->is_coverage = 1;
                $this->coverage    = $geo;
            }
        }
    }


    /**
     * Compile the item reference and WMS coverage. Override the `save`
     * method instead of using the built-in `beforeSave` hook so that the
     * test suite can have access to the original, unmodified method.
     */
    public function save()
    {
        $this->compileWms();
        $this->compileItem();
        $this->importNeatlineFeatures();
        parent::save();
    }


    /**
     * Alias unmodified save (used for testing).
     */
    public function __save()
    {
        parent::__save();
    }


    /**
     * Associate the model with an ACL resource id.
     *
     * @return string The resource id..
     */
    public function getResourceId()
    {
        return 'Neatline_Records';
    }


}
