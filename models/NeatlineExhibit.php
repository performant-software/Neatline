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
    public $image_id;
    public $top_element;
    public $items_h_pos;
    public $items_v_pos;
    public $items_height;
    public $is_map;
    public $is_timeline;
    public $is_items;
    public $default_map_bounds;
    public $default_map_zoom;
    public $default_focus_date;

    /**
     * Validate the add Neatline form.
     *
     * @param string $title The title.
     *
     * @return array $errors A list of errors to display.
     */
    public function validateForm($title, $map, $image)
    {

        $errors = array();

        // No title.
        if ($title == '') {
            $errors['title'] = 'Enter a title.';
        }

        // Map and image.
        if (is_numeric($map) && is_numeric($image)) {
            $errors['map'] = 'Choose a map or an image, not both.';
        }

        return $errors;

    }

    /**
     * Save the add Neatline form.
     *
     * @param string $title The title.
     * @param varchar $map The map id.
     * @param varchar $image The image id.
     *
     * @return boolean True if save is successful.
     */
    public function saveForm($title, $map, $image)
    {

        // Set default values.
        $this->name =                   $title;
        $this->top_element =            'map';
        $this->items_h_pos =            'right';
        $this->items_v_pos =            'bottom';
        $this->items_height =           'full';
        $this->is_map =            1;
        $this->is_timeline =            1;
        $this->is_items =               1;
        $this->map_id =                 null;

        // Check for map.
        if (is_numeric($map)) {
            $this->map_id = $map;
        }

        // Check for image.
        if (is_numeric($image)) {
            $this->image_id = $image;
        }

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
     * Fetch the parent image.
     *
     * @return Omeka_record The map.
     */
    public function getImage()
    {

        return $this->getTable('NeatlineMapsMap')->find($this->image_id);

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
        $this->default_focus_date = $timelineCenter;
        $this->save();

    }

    /**
     * Save viewport arrangement.
     *
     * @param boolean $isMap True if map is present.
     * @param boolean $isTimeline True if timeline is present.
     * @param boolean $isItems True if items is present.
     * @param string $topElement 'map' or 'timeline'.
     * @param string $itemsHorizPos 'left' or 'right'.
     * @param string $itemsVertPos 'top' or 'bottom'.
     * @param string $itemsHeight 'full' or 'partial'.
     *
     * @return Omeka_record The map.
     */
    public function saveViewportArrangement(
        $isMap,
        $isTimeline,
        $isItems,
        $topElement,
        $itemsHorizPos,
        $itemsVertPos,
        $itemsHeight
    )
    {

        // Set values.
        $this->is_map =                 $isMap;
        $this->is_timeline =            $isTimeline;
        $this->is_items =               $isItems;
        $this->top_element =            $topElement;
        $this->items_h_pos =            $itemsHorizPos;
        $this->items_v_pos =            $itemsVertPos;
        $this->items_height =           $itemsHeight;
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
     * Return the id of the data record for the passed item in the current
     * exhibit. If there is no record, return null.
     *
     * @param Omeka_record $item The item record.
     *
     * @return integer $id The id.
     */
    public function getRecordIdByItem($item)
    {

        // Get the data record table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Try to get a record.
        $record = $_recordsTable->getRecordByItemAndExhibit($item, $this);

        return ($record) ? $record->id : null;

    }

    /**
     * Delete status and element text association records
     * on exhibit delete.
     *
     * @return void.
     */
    public function delete()
    {

        // Get the records table, delete child data.
        $_recordsTable = $this->getTable('NeatlineDataRecord');
        $records = $_recordsTable->findBySql('exhibit_id = ?', array($this->id));
        foreach ($records as $record) { $record->delete(); }

        // Call parent.
        parent::delete();

    }

    /**
     * The exhibit should not save if map_id or image_id are both non-null.
     *
     * @return void.
     */
    public function save()
    {

        if (!(!is_null($this->map_id) && !is_null($this->image_id))) {

            parent::save();

        }

        else {
            return false;
        }

    }

}
