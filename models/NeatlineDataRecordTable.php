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

class NeatlineDataRecordTable extends Omeka_Db_Table
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
            $record = new NeatlineDataRecord($item, $neatline);
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
            $this->getSelect()->where('item_id = ' . $item->id
                . ' AND exhibit_id = ' . $neatline->id)
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
            $this->getSelect()->where('exhibit_id = ' . $exhibit->id
                . ' AND slug = "' . $slug . '"')
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
            $this->getSelect()
                 ->where('exhibit_id = ' . $neatline->id . ' AND item_id IS NULL')
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
            $this->getSelect()->where(
                'exhibit_id = ' . $neatline->id .
                ' AND item_id IS NULL' .
                ' AND title LIKE "%' . $search . '%"')
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
            $this->getSelect()->where(
                'exhibit_id = ' . $exhibit->id .
                ' AND (space_active = 1 OR time_active = 1 OR items_active = 1)'
            )->order('display_order ASC')
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
            $this->getSelect()->where(
                'exhibit_id = ' . $exhibit->id . ' AND items_active = 1'
            )->order('display_order ASC')
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
     * an array of id => title associations.
     *
     * @param Omeka_record $exhibit The exhibit record.
     *
     * @return array The id => title array.
     */
    public function getRecordsForSelect($exhibit)
    {

        $idToTitle = array();

        // Get all records in the exhibit.
        $records = $this->getRecordsByExhibit($exhibit);

        // Build array.
        if ($records) {
            foreach ($records as $record) {
                $idToTitle[$record->id] = $record->title;
            }
        }

        return $idToTitle;

    }


    /**
     * JSON constructors.
     */


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

        // If Neatline Maps is installed, get services table.
        if (plugin_is_active('NeatlineMaps')) {
            $_servicesTable = $this->getTable('NeatlineMapsService');
        }

        // Get records.
        $records = $this->getRecordsByExhibit($neatline);

        if ($records) {

            // Walk the records and build out the array.
            foreach ($records as $record) {

                // If the record is active on the map.
                if ($record->space_active == 1) {

                    $layer = array(
                        'id' =>                 $record->id,
                        'item_id' =>            $record->item_id,
                        'title' =>              $record->getTitle(),
                        'slug' =>               $record->getSlug(),
                        'vector_color' =>       $record->getStyle('vector_color'),
                        'stroke_color' =>       $record->getStyle('stroke_color'),
                        'highlight_color' =>    $record->getStyle('highlight_color'),
                        'vector_opacity' =>     $record->getStyle('vector_opacity'),
                        'stroke_opacity' =>     $record->getStyle('stroke_opacity'),
                        'stroke_width' =>       $record->getStyle('stroke_width'),
                        'point_radius' =>       $record->getStyle('point_radius'),
                        'bounds' =>             $record->map_bounds,
                        'zoom' =>               $record->map_zoom,
                        'wkt' =>                $record->getGeocoverage(),
                        'start_visible_date' => $record->getStartVisibleDate(),
                        'end_visible_date' =>   $record->getEndVisibleDate(),
                        'wmsAddress' =>         null,
                        'layers' =>             null,
                        '_native_styles' =>     array(
                          'vector_color' =>     $record->vector_color,
                          'vector_opacity' =>   $record->vector_opacity,
                          'stroke_color' =>     $record->stroke_color,
                          'stroke_opacity' =>   $record->stroke_opacity,
                          'stroke_width' =>     $record->stroke_width,
                          'point_radius' =>     $record->point_radius,
                        )
                    );

                    // If the record has a parent item and Neatline Maps
                    // is present.
                    if (plugin_is_active('NeatlineMaps') && !is_null($record->item_id)) {

                        // Get the parent item, try to get WMS.
                        $item = $record->getItem();
                        $wms = $_servicesTable->findByItem($item);

                        // If there is a WMS, push to layers.
                        if ($wms) {
                            $layer['wmsAddress'] = $wms->address;
                            $layer['layers'] = $wms->layers;
                        }

                    }

                    // Push layer.
                    $data[] = $layer;

                }

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

        if ($records) {

            // Walk the records and build out the array.
            foreach ($records as $record) {

                $eventArray = array(
                    'eventID' =>                $record->id,
                    'slug' =>                   $record->getSlug(),
                    'title' =>                  trim($record->getTitle()),
                    'description' =>            $record->getDescription(),
                    'color' =>                  $record->getStyle('vector_color'),
                    'left_ambiguity' =>         $record->left_percent,
                    'right_ambiguity' =>        $record->right_percent,
                    'textColor' =>             '#000000'
                );

                // Get start and end dates.
                $startDate = $record->getStartDate();
                $endDate = $record->getEndDate();

                // If there is a valid start stamp on the record.
                if ($record->time_active == 1 && preg_match('/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/', $startDate, $matches)) {

                    $eventArray['start'] = $startDate;

                    // If there is a valid end stamp.
                    if ($endDate !== '') {
                        $eventArray['end'] = $endDate;
                    }

                    // Only push if there is at least a start.
                    $data['events'][] = $eventArray;

                }

            }

        }

        // JSON-ify the array.
        return json_encode($data);

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

        // JSON-ify the array.
        return json_encode($data);

    }

}
