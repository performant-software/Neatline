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
                 ->where('(map_active=1)')
        );

        return $records ? $records : false;

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
     * Update a record.
     *
     * @param array $values The PUT values.
     *
     * @return void.
     */
    public function updateRecord($values)
    {
        $record = $this->find((int) $values['id']);
        foreach ($values as $key => $val) $record->setNotEmpty($key, $val);
        $record->save();
    }


    /**
     * JSON constructors.
     */


    /**
     * Construct records JSON for exhibit.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     *
     * @return JSON Array of records.
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
     * Construct records JSON for editor.
     *
     * @param Omeka_Record_AbstractRecord $exhibit The exhibit record.
     * @param string $query The search query.
     * @param int $page The page.
     *
     * @return JSON Array of records.
     */
    public function buildJsonForEditor($exhibit, $query=null, $page=null)
    {

        $data = array();

        // Get records.
        if ($records = $this->getRecordsByExhibit($exhibit)) {

            // Construct record objects.
            foreach ($records as $record) {
                $data[] = $record->buildJsonData();
            }

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
        foreach ($records as $record) $index[$record->id] = $record;
        return $index;
    }

}
