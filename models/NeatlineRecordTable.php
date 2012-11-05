<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Table class for Neatline data records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTable extends Omeka_Db_Table
{

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
            $record = new NeatlineRecord($item, $exhibit);
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
        $records = $this->getItemsRecordsByExhibit($exhibit);

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
            $record = new NeatlineRecord($item, $neatline);
        }

        // Update.
        $record->setStatus($spaceOrTime, $value);
        $record->save();

        return $record;

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
            $this->getSelect()
                 ->where('item_id=?', $item->id)
                 ->where('exhibit_id=?', $neatline->id)
        );

        return $record ? $record : false;

    }

    /**
     * Find a record for a given exhibit and slug.
     *
     * @param Omeka_record $exhibit The exhibit record.
     * @param string $slug The slug.
     *
     * @return Omeka_record $record if a record exists, else boolean False.
     */
    public function getRecordByExhibitAndSlug($exhibit, $slug)
    {

        $record = $this->fetchObject(
            $this->getSelect()
                 ->where('exhibit_id=?', $exhibit->id)
                 ->where('slug=?', $slug)
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
            $this->getSelect()->where('exhibit_id=?', $neatline->id)
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
            $this->getSelect()
                 ->where('exhibit_id=?', $neatline->id)
                 ->where('item_id IS NULL')
                 ->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Simple title searching for Neatline-native records by exhibit.
     *
     * @param Omeka_record $neatline The exhibit record.
     * @param string $search The search string.
     *
     * @return array of Omeka_record The records.
     */
    public function searchNeatlineRecordsByExhibit($neatline, $search)
    {

        // If the search string is empty, get all records.
        if ($search == '') {
            return $this->getNeatlineRecordsByExhibit($neatline);
        }

        $records = $this->fetchObjects(
            $this->getSelect()
                 ->where('exhibit_id=?', $neatline->id)
                 ->where('item_id IS NULL')
                 ->where('title LIKE ?', "%$search%")
        );

        return $records ? $records : false;

    }

    /**
     * Find all records associated with a given exhibit that have either
     * an active space, time, or items status.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getActiveRecordsByExhibit($exhibit)
    {

        $records = $this->fetchObjects(
            $this->getSelect()
                 ->where('exhibit_id=?', $exhibit->id)
                 ->where('(space_active=1 OR time_active=1 OR items_active=1)')
                 ->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Find all records in an exhibit that are active on the map.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getMapRecordsByExhibit($exhibit)
    {

        $records = $this->fetchObjects(
            $this->getSelect()
                 ->where('exhibit_id=?', $exhibit->id)
                 ->where('space_active=1')
                 ->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Find all records in an exhibit that are active on the timeline.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getTimelineRecordsByExhibit($exhibit)
    {

        $records = $this->fetchObjects(
            $this->getSelect()
                 ->where('exhibit_id=?', $exhibit->id)
                 ->where('time_active=1')
                 ->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Find all records associated with a given exhibit that are active in
     * the items pane.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array of Omeka_record The records.
     */
    public function getItemsRecordsByExhibit($exhibit)
    {

        $records = $this->fetchObjects(
            $this->getSelect()
                 ->where('exhibit_id=?', $exhibit->id)
                 ->where('items_active=1')
                 ->order('display_order ASC')
        );

        return $records ? $records : false;

    }

    /**
     * Check whether a given record is active on the map or timeline.
     *
     * @param Omeka_record $item The item record.
     * @param Omeka_record $neatline The exhibit record.
     * @param Omeka_record $viewport 'space', 'time', 'items'.
     *
     * @return boolean True if the record is active.
     */
    public function getRecordStatus($item, $neatline, $viewport)
    {

        // Try to get the record.
        $record = $this->getRecordByItemAndExhibit($item, $neatline);

        // If there is a record.
        if ($record) {

            // If space.
            if ($viewport == 'space') {
                return (bool) $record->space_active;
            }

            // If time.
            else if ($viewport == 'time') {
                return (bool) $record->time_active;
            }

            // If items.
            else if ($viewport == 'items') {
                return (bool) $record->items_active;
            }

        }

        // If no record, return false.
        return false;

    }

    /**
     * Check whether a given slug is unique for an exhibit.
     *
     * @param Omeka_record $exhibit The exhibit record.
     * @param string $slug The slug.
     *
     * @return boolean True if the slug is unique.
     */
    public function slugIsAvailable($record, $exhibit, $slug)
    {

        // Always allow the empty string.
        if ($slug === '') { return true; }

        // Try to get out an existing record with the slug.
        $retrievedRecord = $this->getRecordByExhibitAndSlug($exhibit, $slug);

        // If there is an existing record and the record is not the same
        // as the passed record, return false; otherwise true.
        return ($retrievedRecord && $record->id !== $retrievedRecord->id) ?
            false : true;

    }

    /**
     * Get all records associated with a given exhibit and return
     * an array of id => title associations. If a data record is passed,
     * exclude that record from the list, since a record cannot be the
     * child record of itself.
     *
     * @param Omeka_record $exhibit The exhibit record.
     * @param Omeka_record $record A self record to exclude.
     *
     * @return array The id => title array.
     */
    public function getRecordsForSelect($exhibit, $selfRecord=null)
    {

        $idToTitle = array();

        // Get all records in the exhibit.
        $records = $this->getRecordsByExhibit($exhibit);

        // Build array.
        if ($records) {

            // If a self record has been passed.
            if (!is_null($selfRecord)) {
                foreach ($records as $record) {
                    if ($record->id != $selfRecord->id) {
                        $idToTitle[$record->id] = $record->getTitleForSelect();
                    }
                }
            }

            // If there is no self record.
            else {
                foreach ($records as $record) {
                    $idToTitle[$record->id] = $record->getTitleForSelect();
                }
            }

        }

        return $idToTitle;

    }


    /**
     * JSON constructors.
     */


    /**
     * Construct records JSON for exhibit.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     *
     * @return JSON Array of format:
     * array('map' => array(), 'timeline' => array()).
     */
    public function buildJsonForExhibit($exhibit)
    {

        $data = array();
        $wmsIndex = array();

        // Get records.
        if ($records = $this->getRecordsByExhibit($exhibit)) {

            // Cache records.
            $index = $this->_indexRecords($records);

            // Construct record objects.
            foreach ($records as $record)
                $data[] = $record->buildJsonData($index, $exhibit);

        }

        return $data;

    }

    /**
     * Construct OpenLayers JSON.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildMapJson($exhibit)
    {

        $data = array();
        $wmsIndex = array();

        // Get records.
        if ($records = $this->getMapRecordsByExhibit($exhibit)) {

            // Build out record index.
            $index = $this->_indexRecords($records);
            foreach ($records as $record) {
                $data[] = $record->buildMapDataArray(
                    $index, $wmsIndex, $exhibit
                );
            }

        }

        return $data;

    }

    /**
     * Construct Simile JSON.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildTimelineJson($exhibit)
    {

        // Shell array.
        $data = array(
            'dateTimeFormat' => 'iso8601',
            'events' => array()
        );

        // Get records.
        $records = $this->getTimelineRecordsByExhibit($exhibit);

        if ($records) {
            foreach ($records as $record) {
                $data['events'][] = $record->buildTimelineDataArray();
            }
        }

        return $data;

    }

    /**
     * Construct items JSON.
     *
     * @param Omeka_record $neatline The exhibit record.
     *
     * @return JSON The data.
     */
    public function buildItemsJson($neatline)
    {

        // Shell array.
        $data = array();

        // Get records.
        $records = $this->getItemsRecordsByExhibit($neatline);

        // Walk the records and build out the array.
        foreach ($records as $record) {

            $data[] = array(
                'id' =>                     $record->id,
                'title' =>                  trim($record->getTitle()),
                'slug' =>                   $record->getSlug(),
                'description' =>            $record->getDescription(),
                'start_visible_date' =>     $record->getStartVisibleDate(),
                'end_visible_date' =>       $record->getEndVisibleDate()
            );

        }

        return $data;

    }

    /**
     * This indexes the array of records by their ID.
     *
     * @param array $records Array of data records.
     *
     * @return array $index Indexes associative array of data records.
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    protected function _indexRecords($records)
    {
        $index = array();

        foreach ($records as $record) {
            $index[$record->id] = $record;
        }

        return $index;
    }

}
