<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Row class for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecord extends Neatline_AbstractRecord
{


    public $item_id;            // INT(10) UNSIGNED NULL
    public $exhibit_id;         // INT(10) UNSIGNED NULL
    public $added;              // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;           // TIMESTAMP NULL
    public $title;              // MEDIUMTEXT NULL
    public $body;               // MEDIUMTEXT NULL
    public $coverage;           // GEOMETRY NOT NULL
    public $tags;               // TEXT NULL
    public $widgets;            // TEXT NULL
    public $presenter;          // VARCHAR(100) NULL
    public $fill_color;         // TINYTEXT NULL
    public $select_color;       // TINYTEXT NULL
    public $stroke_color;       // TINYTEXT NULL
    public $point_image;        // TINYTEXT NULL
    public $fill_opacity;       // INT(10) UNSIGNED NULL
    public $select_opacity;     // INT(10) UNSIGNED NULL
    public $stroke_opacity;     // INT(10) UNSIGNED NULL
    public $stroke_width;       // INT(10) UNSIGNED NULL
    public $point_radius;       // INT(10) UNSIGNED NULL
    public $min_zoom;           // INT(10) UNSIGNED NULL
    public $max_zoom;           // INT(10) UNSIGNED NULL
    public $map_zoom;           // INT(10) UNSIGNED NULL
    public $map_focus;          // VARCHAR(100) NULL
    public $wms_address;        // VARCHAR(100) NULL
    public $wms_layers;         // VARCHAR(100) NULL
    public $start_date;         // VARCHAR(100) NULL
    public $end_date;           // VARCHAR(100) NULL
    public $show_after_date;    // VARCHAR(100) NULL
    public $show_before_date;   // VARCHAR(100) NULL
    public $weight;             // INT(10) UNSIGNED NULL


    /**
     * Set foreign keys.
     *
     * @param Item $item The item record.
     * @param NeatlineExhibit $exhibit The exhibit record.
     */
    public function __construct($exhibit = null, $item = null)
    {
        parent::__construct();
        if (!is_null($exhibit)) $this->exhibit_id = $exhibit->id;
        if (!is_null($item)) $this->item_id = $item->id;
    }


    /**
     * Gather all record styleset tables.
     *
     * @return array The tables.
     */
    public function getStylesetTables()
    {
        return apply_filters('neatline_record_stylesets', array());
    }


    /**
     * Get the parent exhibit record.
     *
     * @return Omeka_record The parent exhibit.
     */
    public function getExhibit()
    {
        $exhibits = $this->getTable('NeatlineExhibit');
        return $exhibits->find($this->exhibit_id);
    }


    /**
     * Save data from a POST or PUT request.
     *
     * @param array $values The POST/PUT values.
     */
    public function saveForm($values)
    {

        // Cache the original tags string.
        $oldTags = _nl_explode($this->tags);

        // Mass-assign the form.
        $this->setFromArray($values);

        // If 1 or more tags have been added to the record since the last
        // time it was saved, pull in the _existing_ CSS rules for those
        // tags onto the record before using the record to update the CSS.
        // Otherwise, the existing styles set for the tag(s) in the CSS
        // and on other records with the tag(s) would be clobbered in the
        // next step by the current values on the record being saved.
        // The intuition here is that adding a new tag to a record should
        // have the effect of making the record _conform_ to the already-
        // established styling of other records with that tag - instead of
        // changing the other records to look like this record.
        $newTags = _nl_explode($this->tags);
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
     * @return array The array representation of the record fields.
     */
    public function toArrayForSave()
    {

        $fields = parent::toArrayForSave();

        // Add the coverage.
        if (!empty($fields['coverage'])) {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('{$fields['coverage']}')"
            );
        } else {
            $fields['coverage'] = new Zend_Db_Expr(
                "GeomFromText('POINT(0 0)')"
            );
        }

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
        // Parse the stylesheet.
        $css = _nl_readCSS($this->getExhibit()->styles);

        // Gather style columns.
        $valid = _nl_getStyles();

        // Walk CSS rules.
        foreach ($css as $selector => $rules) {

            // If the tag is being pulled.
            if (in_array($selector, $tags)) {

                // Walk valid CSS rules.
                foreach ($rules as $prop => $val) {
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
     * Compile Omeka item references.
     */
    public function compile() {

        // Break if no parent item.
        if (is_null($this->item_id)) return;

        // Get the item, set on view.
        $item = get_record_by_id('Item', $this->item_id);
        get_view()->item = $item;

        // Pull title and body.
        $this->title = metadata($item, array('Dublin Core', 'Title'));
        $this->body = $this->getItemBody();

    }


    /**
     * Compile the record's `body` field from the parent Omeka item.
     */
    public function getItemBody() {

        $exhibit = $this->getExhibit();
        $tags = _nl_explode($this->tags);

        // Match `item-[slug]-[tag]`.
        foreach ($tags as $tag) { try {
            return get_view()->partial(
                'exhibits/item-'.$exhibit->slug.'-'.$tag.'.php'
            );
        } catch (Exception $e) {}}

        // Match `item-[slug]`.
        try {
            return get_view()->partial(
                'exhibits/item-'.$exhibit->slug.'.php'
            );
        } catch (Exception $e) {}

        // Match `item-[tag]`.
        foreach ($tags as $tag) { try {
            return get_view()->partial(
                'exhibits/item-'.$tag.'.php'
            );
        } catch (Exception $e) {}}

        // Revert to default `item`.
        return get_view()->partial('exhibits/item.php');

    }


    /**
     * Expose unmodified save (used for testing).
     */
    public function __save() {
        parent::save();
    }


    /**
     * Compile `title` and `body` before saving.
     */
    public function save() {
        $this->compile();
        parent::save();
    }


}
