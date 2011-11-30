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
     * @return void.
     */
    public function saveItemFormData(
        $item,
        $neatline,
        $title,
        $description,
        $startDate,
        $startTime,
        $endDate,
        $endTime,
        $vectorColor,
        $leftPercentage,
        $rightPercentage,
        $geoCoverage,
        $spaceStatus,
        $timeStatus
    )
    {

        // Check for an existing record for the item/exhibit.
        $record = $this->getRecordByItemAndExhibit($item, $neatline);

        // If there is not a record, create one.
        if (!$record) {
            $record = new NeatlineDataRecord($item, $neatline);
        }

        // Set parameters.
        $record->title = $title;
        $record->description = $description;
        $record->start_date = $startDate;
        $record->start_time = $startTime;
        $record->end_date = $endDate;
        $record->end_time = $endTime;
        $record->vector_color = $vectorColor;
        $record->geocoverage = $geoCoverage;

        // Set status trackers.
        $record->setStatus('space', $spaceStatus);
        $record->setStatus('time', $timeStatus);

        // Set the ambiguity percentages.
        $record->setPercentage('left', $leftPercentage);
        $record->setPercentage('right', $rightPercentage);

        // Commit.
        $record->save();

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
     * Construct a JSON representation of a record's fields to be used in the
     * item edit form.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return JSON The data.
     */
    public function editFormDataJson($item, $neatline)
    {

        // Shell out the object literal structure.
        $data = array(
            'title' => '',
            'description' => '',
            'start_date' => '',
            'start_time' => '',
            'end_date' => '',
            'end_time' => '',
            'left_percent' => 0,
            'right_percent' => 100,
            'vector_color' => '#724e85'
        );

        // Try to get the record.
        $record = $this->getRecordByItemAndExhibit($item, $neatline);

        // If the record exists, populate the data.
        if ($record) {

            $title = !is_null($record->title) ?
                $record->title :
                neatline_getItemMetadata($item, 'Dublin Core', 'Title');

            $description = !is_null($record->description) ?
                $record->description :
                neatline_getItemMetadata($item, 'Dublin Core', 'Description');

            $color = !is_null($record->vector_color) ?
                $record->vector_color :
                '#724e85';

            // Set the array values.
            $data['title'] =            $title;
            $data['description'] =      $description;
            $data['vector_color'] =     $color;
            $data['start_date'] =       (string) $record->start_date;
            $data['start_time'] =       (string) $record->start_time;
            $data['end_date'] =         (string) $record->end_date;
            $data['end_time'] =         (string) $record->end_time;
            $data['left_percent'] =     $record->left_ambiguity_percentage;
            $data['right_percent'] =    $record->right_ambiguity_percentage;

        }

        // Otherwise, try to find existing DC data.
        else {

            $data['title'] = neatline_getItemMetadata(
                $item,
                'Dublin Core',
                'Title');

            $data['description'] = neatline_getItemMetadata(
                $item,
                'Dublin Core',
                'Description');

        }

        // JSON-ify the array.
        return json_encode($data);

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

}
