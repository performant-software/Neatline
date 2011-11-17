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
     * @return boolean True if the save succeeds.
     */
    public function saveData(
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
        $geoCoverage
    )
    {

        // Check for an existing record for the item/exhibit.
        $record = $this->_checkForExistingRecord($item, $neatline);

        // If there is a record, update it.
        if ($record) {
            $record->populateData(
                $title,
                $description,
                $startDate,
                $startTime,
                $endDate,
                $endTime,
                $vectorColor,
                $leftPercentage,
                $rightPercentage,
                $geoCoverage);
        }

        // If there is not a record, create one.
        else {
            $newRecord = new NeatlineDataRecord(
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
                $geoCoverage);
        }

    }

    /**
     * Check to see if there is a record for a given item and exhibit.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return Omeka_record $record if a record exists, else boolean False.
     */
    protected function _checkForExistingRecord($item, $neatline)
    {

        $record = $this->findBySql('item_id = ? AND exhibit_id = ?', array(
            $item->id,
            $neatline->id,
        ));

        return $record ? $record : false;

    }

}
