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
        $recordsTable = $this->getTable('NeatlineRecord');
        return $recordsTable->countActiveRecordsByExhibit($this);
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
