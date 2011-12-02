<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Record class for exhibits.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php

class NeatlineExhibit extends Omeka_record
{

    /**
     * Record attributes.
     */
    public $added;
    public $name;
    public $map_id;
    public $top_element;
    public $undated_items_position;
    public $undated_items_height;
    public $is_map;
    public $is_timeline;
    public $is_undated_items;
    public $default_map_bounds;
    public $default_map_zoom;
    public $default_timeline_focus_date;

    /**
     * Validate the add Neatline form.
     *
     * @param $_post The post data.
     *
     * @return array $errors A list of errors to display.
     */
    public function validateForm($_post)
    {

        $errors = array();

        // Title.
        if ($_post['title'] == '') {
            $errors['title'] = 'Enter a title';
        }

        return $errors;

    }

    /**
     * Save the add Neatline form.
     *
     * @param $_post The post data.
     *
     * @return boolean True if save is successful.
     */
    public function saveForm($_post)
    {

        $this->populateData($_post);
        return $this->save() ? true : false;

    }

    /**
     * Populate parameters.
     *
     * @param $_post The post data.
     *
     * @return void.
     */
    public function populateData($_post)
    {

        $this->added = neatline_getMysqlDatetime();
        $this->name = $_post['title'];

        // Check for map.
        if (is_numeric($_post['map'])) {
            $this->map_id = $_post['map'];
            $this->is_map = 1;
        } else {
            $this->map_id = null;
            $this->is_map = 0;
        }

        // By default, enable the timeline.
        $this->is_timeline = 1;

        // By default, activate undated items.
        $this->is_undated_items = 1;

        // Set defaults layout parameters.
        $this->top_element = 'map';
        $this->undated_items_position = 'left';
        $this->undated_items_height = 'partial';

    }

    /**
     * Fetch the parent map.
     *
     * @return Omeka_record The map.
     */
    public function getMap()
    {

        return $this->getTable('NeatlineMapsMap')->find($this->map_id);

    }

    /**
     * Save default viewport positions.
     *
     * @param string $mapExtent The bounding box for the map.
     * @param string $mapZoom The integer zoom value.
     * @param string $timelineCenter The timestamp for the timeline focus.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportPositions($mapExtent, $mapZoom, $timelineCenter)
    {

        // Set values.
        $this->default_map_bounds = $mapExtent;
        $this->default_map_zoom = intval($mapZoom);
        $this->default_timeline_focus_date = $timelineCenter;
        $this->save();

    }

    /**
     * Save viewport arrangement.
     *
     * @param boolean $isMap True if map is present.
     * @param boolean $isTimeline True if timeline is present.
     * @param boolean $isUndatedItems True if undated items is present.
     * @param string $topElement 'map' or 'timeline'.
     * @param string $udiPosition 'left' or 'right'.
     * @param string $udiHeight 'full' or 'partial'.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportArrangement(
        $isMap,
        $isTimeline,
        $isUndatedItems,
        $topElement,
        $udiPosition,
        $udiHeight
    )
    {

        // Set values.
        $this->is_map = $isMap;
        $this->is_timeline = $isTimeline;
        $this->is_undated_items = $isUndatedItems;
        $this->top_element = $topElement;
        $this->undated_items_position = $udiPosition;
        $this->undated_items_height = $udiHeight;
        $this->save();

    }

    /**
     * Check whether a given record is active on the map or timeline.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return boolean True if the record is active.
     */
    public function getRecordStatus($item, $spaceOrTime)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Get the status.
        return $_recordsTable->getRecordStatus($item, $this, $spaceOrTime);

    }

    /**
     * Delete status and element text association records
     * on exhibit delete.
     *
     * @return JSON string The events JSON.
     */
    public function delete()
    {

        // Get the records table, delete child data.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->findBySql('neatline_id = ?', array($this->id));
        foreach ($records as $record) { $record->delete(); }

        // Call parent.
        parent::delete();

    }

}
