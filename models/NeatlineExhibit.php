<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibit extends Neatline_Row_Expandable
    implements Zend_Acl_Resource_Interface
{


    public $owner_id = 0;   // INT(10) UNSIGNED NOT NULL DEFAULT 0
    public $added;          // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;       // TIMESTAMP NULL
    public $published;      // TIMESTAMP NULL
    public $query;          // TEXT NULL
    public $spatial_layers; // TEXT NULL
    public $spatial_layer;  // TEXT NULL
    public $image_layer;    // TEXT NULL
    public $image_height;   // SMALLINT UNSIGNED NULL
    public $image_width;    // SMALLINT UNSIGNED NULL
    public $wms_address;    // TEXT NULL
    public $wms_layers;     // TEXT NULL
    public $widgets;        // TEXT NULL
    public $title;          // TEXT NULL
    public $slug;           // VARCHAR(100) NOT NULL
    public $narrative;      // LONGTEXT NULL
    public $public;         // TINYINT(1) NOT NULL
    public $styles;         // TEXT NULL
    public $map_focus;      // VARCHAR(100) NULL
    public $map_zoom;       // INT(10) UNSIGNED NULL


    /**
     * If the exhibit is being published to the public site for the first
     * time, update the `published` timestamp.
     *
     * @param array $values The POST/PUT data.
     */
    public function saveForm($values)
    {

        // Assign the values.
        $this->setArray($values);

        // If the exhibit is being set "public" for the first time, set
        // the `published` timestamp to the current date.

        if (is_null($this->published) && $this->public == 1) {
            $this->published = date(self::DATE_FORMAT);
        }

        $this->save();

    }


    /**
     * Get the number of active records in the exhibit.
     *
     * @return integer The record count.
     */
    public function getNumberOfRecords()
    {
        return $this->getTable('NeatlineRecord')->count(array(
            'exhibit_id' => $this->id
        ));
    }


    /**
     * Check whether a widget is enabled.
     *
     * @param string $widget The id of the widget.
     * @return boolean True if the widget is enabled.
     */
    public function hasWidget($id)
    {
        return in_array($id, nl_explode($this->widgets));
    }


    /**
     * Update records in an exhibit according to the value-defined style
     * definitions in the `styles` CSS. For example, if `styles` is:
     *
     * .tag {
     *   fill-color: #ffffff;
     *   stroke-color: auto;
     * }
     *
     * The fill color on records tagged with `tag` will be updated to
     * `#ffffff`, but the stroke color will be unchanged since no explicit
     * value is set in the CSS.
     */
    public function pushStyles()
    {

        // Parse the stylesheet.
        $css = nl_readCSS($this->styles);

        // Load records table.
        $records = $this->getTable('NeatlineRecord');

        // Gather style columns.
        $valid = nl_getStyles();

        foreach ($css as $tag => $rules) {

            $where = array('exhibit_id = ?' => $this->id);

            // If selector is `all`, update all records in the exhibit;
            // otherwise, just match records with the tag.
            if ($tag != 'all') {
                $where['MATCH (tags) AGAINST (? IN BOOLEAN MODE)']= $tag;
            }

            // Walk valid CSS rules.
            $set = array();
            foreach ($rules as $prop => $val) {
                if (in_array($prop, $valid)) {

                    // Push value if not `auto` or `none`.
                    if ($val != 'auto' && $val != 'none') {
                        $set[$prop] = $val;
                    }

                    // If `none`, push NULL.
                    else if ($val == 'none') {
                        $set[$prop] = null;
                    }

                }
            }

            // Update records.
            if (!empty($set)) $records->update(
                $records->getTableName(), $set, $where
            );

        }

    }


    /**
     * Update the exhibit stylesheet with values from a specific record.
     * For example, if `styles` is:
     *
     * .tag {
     *   fill-color: #111111;
     *   stroke-color: #222222;
     * }
     *
     * And the passed record is tagged with `tag` has a `fill_color` of
     * `#333333` and a `stroke_color` of `#444444`, the stylesheet should
     * be updated to:
     *
     * .tag {
     *   fill-color: #333333;
     *   stroke-color: #444444;
     * }
     *
     * @param NeatlineRecord $record The record to update from.
     */
    public function pullStyles($record)
    {

        // Parse the stylesheet.
        $css = nl_readCSS($this->styles);

        // Explode record tags.
        $tags = nl_explode($record->tags);

        // Gather style columns.
        $valid = nl_getStyles();

        foreach ($css as $selector => $rules) {

            // Is the record tagged with the selector?
            if (in_array($selector, $tags) || $selector == 'all') {

                // Scan valid rule definitions.
                foreach ($rules as $prop => $val) {
                    if (in_array($prop, $valid)) {

                        // Get the record value.
                        $value = !is_null($record->$prop) ?
                            $record->$prop : 'none';

                        // Update the CSS.
                        $css[$selector][$prop] = $value;

                    }
                }

            }

        }

        // Recompile the stylesheet.
        $this->styles = nl_writeCSS($css);

    }


    /**
     * Measure the size of the image defined by `image_layer`.
     */
    public function compileImageSize()
    {
        // TODO|dev
        if (!is_null($this->image_layer)) {
            print_r(getimagesize($this->image_layer));
            exit;
        }
    }


    /**
     * Delete all records that belong to the exhibit.
     */
    public function deleteChildRecords()
    {

        // Get records table and name.
        $records = $this->getTable('NeatlineRecord');
        $rName = $records->getTableName();

        // Gather record expansion tables.
        foreach (nl_getRecordExpansions() as $expansion) {

            $eName = $expansion->getTableName();

            // Delete expansion rows on child records.
            $this->_db->query("DELETE $eName FROM $eName
                INNER JOIN $rName ON $eName.parent_id = $rName.id
                WHERE $rName.exhibit_id = $this->id
            ");

        }

        // Delete child records.
        $records->delete($rName, array('exhibit_id=?' => $this->id));

    }


    /**
     * Measure the image layer when the exhibit is * saved.
     */
    protected function beforeSave()
    {
        // $this->compileImageSize();
    }


    /**
     * Delete all child records when the exhibit is deleted.
     */
    protected function beforeDelete()
    {
        $this->deleteChildRecords();
    }


    /**
     * Before saving, run `narrative` through an HTML purifier.
     *
     * @return array.
     */
    public function getPurifiedFields()
    {
        return array('narrative');
    }


    /**
     * Associate the model with an ACL resource id.
     *
     * @return string The resource id..
     */
    public function getResourceId()
    {
        return 'Neatline_Exhibits';
    }


}
