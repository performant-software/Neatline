<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibit extends Neatline_ExpandableRow
    implements Zend_Acl_Resource_Interface
{


    public $user_id;        // INT(10) UNSIGNED NOT NULL
    public $added;          // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;       // TIMESTAMP NOT NULL
    public $query;          // TEXT NULL
    public $base_layers;    // TEXT NULL
    public $base_layer;     // VARCHAR(100) NULL
    public $widgets;        // TEXT NULL
    public $title;          // TEXT NULL
    public $slug;           // VARCHAR(100) NOT NULL
    public $narrative;      // LONGTEXT NULL
    public $public = 0;     // TINYINT(1) NOT NULL
    public $styles;         // TEXT NULL
    public $map_focus;      // VARCHAR(100) NULL
    public $map_zoom;       // INT(10) UNSIGNED NULL


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
                $where['tags REGEXP ?'] = '[[:<:]]'.$tag.'[[:>:]]';
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
     * Delete all child data records when an exhibit is deleted.
     */
    protected function beforeDelete()
    {

        parent::beforeDelete();

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
     * Associate the model with an ACL resource id.
     *
     * @return string The resource id..
     */
    public function getResourceId()
    {
        return 'NeatlineExhibit';
    }


}
