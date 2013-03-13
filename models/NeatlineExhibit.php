<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Record class for exhibits.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibit extends Neatline_AbstractRecord
{


    public $added;          // TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    public $modified;       // TIMESTAMP NULL
    public $base_layers;    // TEXT NULL
    public $base_layer;     // VARCHAR(100) NULL
    public $widgets;        // TEXT NULL
    public $title;          // TEXT NULL
    public $slug;           // VARCHAR(100) NOT NULL
    public $description;    // TEXT NULL
    public $public = 0;     // TINYINT(1) NOT NULL
    public $styles;         // TEXT NULL
    public $map_focus;      // VARCHAR(100) NULL
    public $map_zoom;       // INT(10) UNSIGNED NULL


    /**
     * Implode `widgets` and `base_layers` before saving.
     *
     * @param array $values The POST/PUT values.
     */
    public function saveForm($values)
    {
        foreach ($values as $k => $v) {
            if (is_array($v)) $values[$k] = implode(',', $v);
        }
        parent::saveForm($values);
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
        return in_array($id, _nl_explode($this->widgets));
    }


    /**
     * Update records in an exhibit according to the value-defined style
     * definitions in the `styles` CSS. For example, if `styles` is:
     *
     * .tag {
     *   vector-color: #ffffff;
     *   stroke-color: auto;
     * }
     *
     * The vector color on records tagged with `tag` will be updated to
     * #ffffff, but the stroke color will be unchanged since no explicit
     * value is set in the CSS.
     */
    public function pushStyles()
    {

        // Parse the stylesheet.
        $css = _nl_readCSS($this->styles);

        // Load records table.
        $records = $this->getTable('NeatlineRecord');

        // Gather style columns.
        $valid = _nl_getStyles();

        foreach ($css as $tag => $rules) {

            $where = array('exhibit_id = ?' => $this->id);

            // If selector is `all`, update all records in the exhibit;
            // otherwise, just match records with the tag.
            if ($tag != 'all') {
                $where['tags REGEXP ?'] = '[[:<:]]'.$tag.'[[:>:]]';
            }

            // Form the array of key-value pairs to update. Ignore rules
            // if the value is `auto` or the property is invalid.
            $set = array();
            foreach ($rules as $prop => $val) {
                if (in_array($prop, $valid) && $val != 'auto') {
                    $set[$prop] = $val;
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
     *   vector-color: #111111;
     *   stroke-color: #222222;
     * }
     *
     * And the passed record is tagged with `tag` has a `vector_color` of
     * `#333333` and a `stroke_color` of `#444444`, the stylesheet should
     * be updated to:
     *
     * .tag {
     *   vector-color: #333333;
     *   stroke-color: #444444;
     * }
     *
     * @param NeatlineRecord $record The record to update from.
     */
    public function pullStyles($record)
    {

        // Parse the stylesheet.
        $css = _nl_readCSS($this->styles);

        // Explode record tags.
        $tags = _nl_explode($record->tags);

        // Gather style columns.
        $valid = _nl_getStyles();

        foreach ($css as $selector => $rules) {

            // Is the record tagged with the selector?
            if (in_array($selector, $tags)) {

                // Update each CSS rule to match the record values.
                foreach ($rules as $prop => $val) {
                    if (in_array($prop, $valid)) {
                        $css[$selector][$prop] = $record->$prop;
                    }
                }

            }

        }

        // Recompile the stylesheet.
        $this->styles = _nl_writeCSS($css);

    }


    /**
     * Delete all child data records when an exhibit is deleted.
     */
    protected function beforeDelete()
    {
        $recordsTable = $this->getTable('NeatlineRecord');
        $recordsTable->delete("{$this->_db->prefix}neatline_records",
            array('exhibit_id = ?' => $this->id)
        );
    }


}
