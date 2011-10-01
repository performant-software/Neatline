<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Table class for Neatline record status.
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

class NeatlineRecordStatusTable extends Omeka_Db_Table
{

    /**
     * Save changes made to record statuses.
     *
     * @param Omeka_record $item The item.
     * @param Omeka_record $neatline The Neatline exhibit.
     * @param string $spaceOrTime 'space' or 'time'.
     * @param string $value 'true' or 'false'.
     *
     * @return void
     */
    public function saveStatus($item, $neatline, $spaceOrTime, $value)
    {

        // Try to find a record for the item.
        $record = $this->fetchObject(
            $this->getSelect()->where('item_id = ' . $item->id .
                ' AND neatline_id = ' . $neatline->id)
        );

        // If record exists, update.
        if ($record != null) {

            switch ($spaceOrTime) {

                case 'space':
                    $record->space = ($value == 'true') ? 1 : 0;
                break;

                case 'time':
                    $record->time = ($value == 'true') ? 1 : 0;
                break;

            }

            // If both fields are null or false, drop the record.
            if (($record->space == 0 || $record->space == null)
                && ($record->time == 0 || $record->time == null)) {

                $record->delete();

            } else {

                $record->save();

            }

        }

        // Otherwise, create a record.
        else {

            $record = new NeatlineRecordStatus();
            $record->neatline_id = $neatline->id;
            $record->item_id = $item->id;

            switch ($spaceOrTime) {

                case 'space':
                    $record->space = ($value == 'true') ? 1 : 0;
                break;

                case 'time':
                    $record->time = ($value == 'true') ? 1 : 0;
                break;

            }

            $record->save();

        }

    }

    /**
     * Check for a record statuses.
     *
     * @param Omeka_record $item The item.
     * @param Omeka_record $neatline The Neatline exhibit.
     * @param string $spaceOrTime 'space' or 'time'.
     *
     * @return void
     */
    public function checkStatus($item, $neatline, $spaceOrTime)
    {

        // Try to find a record for the item.
        $record = $this->fetchObject(
            $this->getSelect()->where('item_id = ' . $item->id .
                ' AND neatline_id = ' . $neatline->id)
        );

        // If record exists, update.
        if ($record != null) {

            switch ($spaceOrTime) {

                case 'space':
                    return ($record->space == 1) ? true : false;
                break;

                case 'time':
                    return ($record->time == 1) ? true : false;
                break;

            }

        }

        // Otherwise, create a record.
        else {

            return false;

        }

    }

    /**
     * Get all items with active time records for a given Neatline exhibit.
     *
     * @param integer $neatline_id The id of the exhibit.
     *
     * @return array of Omeka_record $items The array of item objects.
     */
    public function getItemsWithActiveTimeRecords($neatline_id)
    {

        // Get the items table.
        $_itemsTable = $this->getTable('Item');

        // Get the matching status records.
        $statuses = $this->findBySql('neatline_id = ? AND time = 1', array($neatline_id));

        // Walk the results, fetch the items, pack them up.
        $items = array();
        foreach ($statuses as $status) {
            $items[] = $_itemsTable->find($status->item_id);
        }

        return $items;

    }

}
