<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Table class for Neatline data records.
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

class NeatlineDataRecordTable extends Omeka_Db_Table
{

    /**
     * Commit changes ajaxed back from the editor.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     * @param string $title The title.
     * @param string $description The description.
     * @param string $startDate The month/day/year of the start.
     * @param string $startTime The time of the start.
     * @param string $endDate The month/day/year of the end.
     * @param string $endTime The time of the end.
     * @param string $vectorColor The hex value for the feature vectors.
     * @param string $leftPercentage The left side ambiguity parameter.
     * @param string $rightPercentage The right side ambiguity parameter.
     * @param array $geoCoverage The array of geocoverage data from
     * the map annotations.
     *
     * @return array $statuses An associative array with the final space and time
     * statuses that result from the data commit.
     */
    public function saveItemFormData(
        $record,
        $title,
        $description,
        $startDate,
        $startTime,
        $endDate,
        $endTime,
        $vectorColor,
        $left,
        $right,
        $geoCoverage,
        $spaceStatus,
        $timeStatus
    )
    {

        // Capture starting space and time parameters and statuses.
        $startingSpaceStatus = $record->space_active;
        $startingTimeStatus = $record->time_active;
        $startingCoverage = $record->coverage;
        $startingTime = array(
            $record->start_date,
            $record->start_time,
            $record->end_date,
            $record->end_time,
        );

        // Set parameters.
        $record->title = $title;
        $record->description = $description;
        $record->start_date = $startDate;
        $record->start_time = $startTime;
        $record->end_date = $endDate;
        $record->end_time = $endTime;
        $record->vector_color = $vectorColor;
        $record->geocoverage = $geoCoverage;
        $record->setPercentages($left, $right);

        // Check for new space data.
        if (in_array($startingCoverage, array('', null)) && $geoCoverage != '') {
            $spaceStatus = true;
        }

        // Check for new time data.
        if ($startingTime = array('','','','') &&
            ($startDate != '' || $startTime != '' || $endDate != '' || $endTime != '')) {
            $timeStatus = true;
        }

        // Set the statuses.
        $record->setStatus('space', $spaceStatus);
        $record->setStatus('time', $timeStatus);

        // Commit.
        $record->save();

        // Return an array with the final statuses.
        return array(
            'space' => is_bool($spaceStatus) ? $spaceStatus : (bool) $startingSpaceStatus,
            'time' => is_bool($timeStatus) ? $timeStatus : (bool) $startingTimeStatus
        );

    }

    /**
     * For a given item and exhibit combination, check to see if there is an existing
     * record. If there is, return it. If not, create a new record and return it.
     *
     * @param Omeka_record $item The item.
     * @param Omeka_record $exhibit The exhibit.
     *
     * @return void.
     */
    public function createOrGetRecord($item, $exhibit)
    {

        // Try to get existing record.
        $record = $this->getRecordByItemAndExhibit($item, $exhibit);

        // If no record, create.
        if (!$record) {
            $record = new NeatlineDataRecord($item, $exhibit);
            $record->save();
        }

        return $record;

    }

    /**
     * Save a new record ordering.
     *
     * @param Omeka_record $exhibit The exhibit record.
     * @param array $order The ordering.
     *
     * @return void.
     */
    public function saveOrder($exhibit, $order)
    {

        // Get all records for the exhibit, flip the order.
        $records = $this->getActiveRecordsByExhibit($exhibit);

        foreach ($records as $record) {
            $record->display_order = $order[$record->id];
            $record->save();
        }

    }

    /**
     * Save a record status change.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     * @param string $spaceOrTime 'space' or 'time'.
     * @param boolean $value Boolean value of new status.
     *
     * @return void.
     */
    public function saveRecordStatus($item, $neatline, $spaceOrTime, $value)
    {

        // Get the record.
        $record = $this->getRecordByItemAndExhibit($item, $neatline);

        // If there is not an existing record, create one.
        if (!$record) {
            $record = new NeatlineDataRecord($item, $neatline);
        }

        // Update.
        $record->setStatus($spaceOrTime, $value);
        $record->save();

    }

    /**
     * Find a record for a given item and exhibit.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $record if a record exists, else boolean False.
     */
    public function getRecordByItemAndExhibit($item, $neatline)
    {

        $record = $this->fetchObject(
            $this->getSelect()->where('item_id = ' . $item->id
                . ' AND exhibit_id = ' . $neatline->id)
        );

        return $record ? $record : false;

    }

    /**
     * Find all records associated with a given exhibit.
     *
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getRecordsByExhibit($neatline)
    {

        $records = $this->fetchObjects(
            $this->getSelect()->where('exhibit_id = ' . $neatline->id)
        );

        return $records ? $records : false;

    }

    /**
     * Find all records associated with a given exhibit that do not have a
     * parent item.
     *
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getNeatlineRecordsByExhibit($neatline)
    {

        $records = $this->fetchObjects(
            $this->getSelect()->where('exhibit_id = ' . $neatline->id . 
                ' AND item_id IS NULL')
        );

        return $records ? $records : false;

    }

    /**
     * Find all records associated with a given exhibit that have either
     * an active space or time status.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getActiveRecordsByExhibit($exhibit)
    {

        $records = $this->fetchObjects(
            $this->getSelect()->where(
                'exhibit_id = ' . $exhibit->id .
                ' AND (space_active = 1 OR time_active = 1)'
            )->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Check whether a given record is active on the map or timeline.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return boolean True if the record is active.
     */
    public function getRecordStatus($item, $neatline, $spaceOrTime)
    {

        // Try to get the record.
        $record = $this->getRecordByItemAndExhibit($item, $neatline);

        // If there is a record.
        if ($record) {

            // If space.
            if ($spaceOrTime == 'space') {
                return (bool) $record->space_active;
            }

            // If time.
            else {
                return (bool) $record->time_active;
            }

        }

        // If no record, return false.
        return false;

    }


    /**
     * JSON constructors.
     */


    /**
     * Construct a JSON representation of a record's fields to be used in the
     * item edit form.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildEditFormJson($item, $neatline)
    {

        // Shell out the object literal structure.
        $data = array(
            'title' =>                      '',
            'description' =>                '',
            'start_date' =>                 '',
            'start_time' =>                 '',
            'end_date' =>                   '',
            'end_time' =>                   '',
            'left_percent' =>               0,
            'right_percent' =>              100,
            'vector_color' =>               '#724e85'
        );

        $data['title'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Title');

        $data['description'] = neatline_getItemMetadata(
            $item,
            'Dublin Core',
            'Description');

        // JSON-ify the array.
        return json_encode($data);

    }

    /**
     * Construct OpenLayers JSON.
     *
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildMapJson($neatline)
    {

        // Shell array.
        $data = array();

        // Get records.
        $records = $this->getRecordsByExhibit($neatline);

        // Walk the records and build out the array.
        foreach ($records as $record) {

            // If the geocoverage is populated.
            if ($record->space_active == 1) {

                $data[] = array(
                    'id' =>                 $record->id,
                    'item_id' =>            $record->item_id,
                    'title' =>              $record->getTitle(),
                    'vector_color' =>       $record->vector_color,
                    'vector_opacity' =>     $record->vector_opacity,
                    'stroke_opacity' =>     $record->stroke_opacity,
                    'stroke_color' =>       $record->stroke_color,
                    'stroke_width' =>       $record->stroke_color,
                    'point_radius' =>       $record->point_radius,
                    'bounds' =>             $record->map_bounds,
                    'zoom' =>               $record->map_zoom,
                    'wkt' =>                $record->getGeocoverage()
                );

            }

        }

        // JSON-ify the array.
        return json_encode($data);

    }

    /**
     * Construct Simile JSON.
     *
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildTimelineJson($neatline)
    {

        // Shell array.
        $data = array(
            'dateTimeFormat' => 'iso8601',
            'events' => array()
        );

        // Get records.
        $records = $this->getRecordsByExhibit($neatline);

        // Walk the records and build out the array.
        foreach ($records as $record) {

            // Build the timestamps.
            $timestamps = neatline_generateTimegliderTimestamps(
                $record->start_date,
                $record->start_time,
                $record->end_date,
                $record->end_time
            );

            $eventArray = array(
                'eventID' =>                $record->id,
                'title' =>                  $record->title,
                'description' =>            $record->description,
                'color' =>                  $record->vector_color,
                'textColor' =>              '#4a4a4a',
                'left_ambiguity' =>         $record->left_percent,
                'right_ambiguity' =>        $record->right_percent
            );

            // If there is a valid start stamp.
            if (!is_null($timestamps[0]) && $record->time_active == 1) {

                $eventArray['start'] = $timestamps[0];

                // If there is a valid end stamp.
                if (!is_null($timestamps[1])) {
                    $eventArray['end'] = $timestamps[1];
                }

                // Only push if there is at least a start.
                $data['events'][] = $eventArray;

            }

        }

        // JSON-ify the array.
        return json_encode($data);

    }

}
