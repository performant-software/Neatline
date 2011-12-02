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
     * Construct the events JSON for timeglider.
     *
     * @return JSON string The events JSON.
     */
    public function timelineEventsJson()
    {

        // Get the records table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Shell array for the events data.
        $json = array(
            'dateTimeFormat' => 'Gregorian',
            'events' => array()
        );

        // // Hit the record statuses table to get a list of all
        // // items that have active time records.
        // $activeItems = $_statusesTable->getItemsWithActiveTimeRecords($this->id);

        // // Walk the items with active records, fetch the time records,
        // // pack them up.
        // foreach ($activeItems as $item) {

        //     // Fetch record.
        //     $record = $this->getTimeRecord($item);

        //     // Title and description fields.
        //     $title = $this->getTextByItemAndField($item, 'Title');
        //     $description = $this->getTextByItemAndField($item, 'Description');

        //     // Date/time raw strings.
        //     $startDate = $this->getTimeTextByItemAndField($item, 'start_date');
        //     $startTime = $this->getTimeTextByItemAndField($item, 'start_time');
        //     $endDate = $this->getTimeTextByItemAndField($item, 'end_date');
        //     $endTime = $this->getTimeTextByItemAndField($item, 'end_time');

        //     // Pass the pieces through the timestamp algorithm.
        //     $timestamps = neatline_generateTimegliderTimestamps(
        //         $startDate,
        //         $startTime,
        //         $endDate,
        //         $endTime
        //     );

        //     // Color and ambiguity settings.
        //     $color = $this->getTextByItemAndField($item, 'Identifier');
        //     $leftPercentage = $record->left_ambiguity_percentage;
        //     $rightPercentage = $record->right_ambiguity_percentage;

        //     $eventArray = array(
        //         'eventID' => $item->id,
        //         'title' => $title,
        //         'description' => $description,
        //         'color' => $color,
        //         'textColor' => '#6b6b6b',
        //         'left_ambiguity' => $leftPercentage,
        //         'right_ambiguity' => $rightPercentage
        //     );

        //     // If there is a valid start stamp.
        //     if (!is_null($timestamps[0])) {

        //         $eventArray['start'] = $timestamps[0];

        //         // If there is a valid end stamp.
        //         if (!is_null($timestamps[1])) {
        //             $eventArray['end'] = $timestamps[1];
        //         }

        //         // Only push if there is at least a start.
        //         $json['events'][] = $eventArray;

        //     }

        // }

        return json_encode($json);

    }

    /**
     * Build the vector JSON for the map.
     *
     * @return JSON string The events JSON.
     */
    public function openlayersVectorJson()
    {

        // Get the data records table.
        $_recordsTable = $this->getTable('NeatlineDataRecord');

        // Shell array for the vector data.
        $json = array();

        // // Hit the record statuses table to get a list of all
        // // items that have active space records.
        // $activeItems = $_statusesTable->getItemsWithActiveSpaceRecords($this->id);

        // // Walk the items with active records, fetch the time records,
        // // pack them up.
        // foreach ($activeItems as $item) {

        //     // Try to find a record.
        //     $record = $_recordsTable->findByElement($this->id, $item->id, $coverageElement->id);

        //     if (!is_null($record)) {

        //         // Weird hack to get rid of the opening and closing brackets that OpenLayers
        //         // tacks onto the geometry descriptions by default. They cause errors when the
        //         // JavaScript tries to ingest them.
        //         $text = str_replace(array('[', ']'), '', json_decode($record->getElementText()->text));
        //         $title = $this->getTextByItemAndField($item, 'Title');
        //         $color = $this->getTextByItemAndField($item, 'Identifier');

        //         $json[] = array(
        //             'id' => $item->id,
        //             'title' => $title,
        //             'color' => $color,
        //             'wkt' => $text
        //         );

        //     }

        // }

        return json_encode($json);

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
