<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Ajax helper functions.
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

/**
 * Query for items and crop down the result objects for the
 * item browser
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getItemsForBrowser(
    $search = null,
    $tags = null,
    $types = null,
    $collections = null,
    $all = null
)
{

    // If nothing is selected, return an empty array.
    if (!$all && $tags == null && $types == null && $collections == null) {
        return array();
    }

    $_db = get_db();
    $itemsTable = $_db->getTable('Item');

    $select = $itemsTable->getSelect();
    $params = array();

    if ($search) {
        $params['search'] = $search;
    }

    // Apply the search string to the table class.
    $itemsTable->applySearchFilters($select, $params);

    // Construct the final where clause.
    if (!$all) {

        $whereClause = array();

        // Build types clause.
        if ($types != null) {
            $typesString = implode(',', $types);
            $whereClause[] = 'item_type_id IN (' . $typesString . ')';
        }

        // Build collections clause.
        if ($collections != null) {
            $collectionsString = implode(',', $collections);
            $whereClause[] = 'collection_id IN (' . $collectionsString . ')';
        }

        // Build tags clause.
        if ($tags != null) {
            foreach ($tags as $id) {
                $whereClause[] = 'EXISTS (SELECT * FROM omeka_taggings '
                    . 'WHERE i.id = relation_id AND tag_id = ' . $id . ')';
            }
        }

        // Collapse into single string.
        $whereClause = implode(' OR ', $whereClause);

        if ($whereClause != '') {
            $select->where($whereClause);
        }

    }

    return $itemsTable->fetchObjects($select);

}

/**
 * Check to see whether an item has an active space or time record for a
 * given Neatline exhibit. If it does, return the 'checked' property for
 * the template checkbox; if not, return an empty string.
 *
 * @param Omeka_record $neatline The Neatline exhibit.
 * @param Omeka_record $item The item.
 * @param string $spaceOrTime 'space' or 'time'.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getRecordStatusForCheckBox($neatline, $item, $spaceOrTime)
{

    $_db = get_db();
    $statusesTable = $_db->getTable('NeatlineRecordStatus');

    return $statusesTable
        ->checkStatus($item, $neatline, $spaceOrTime) ? 'checked' : '';

}

/**
 * Check to see whether an item has extant data in it's DC record that
 * could be used for map or timeline data. If so, return the 'data-exists'
 * class for the template checkbox; if not, return an empty string.
 *
 * @param Omeka_record $neatline The Neatline exhibit.
 * @param Omeka_record $item The item.
 * @param string $spaceOrTime 'space' or 'time'.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getExistingDataStatusForCheckBox($neatline, $item, $spaceOrTime)
{

    $_db = get_db();
    $isData = false;

    switch ($spaceOrTime) {

        case 'space':

            if ($neatline->getTextByItemAndField($item, 'Coverage')) {
                $isData = true;
            }

        break;

        case 'time':

            $startDate = $neatline->getTimeTextByItemAndField($item, 'start_date');
            $startTime = $neatline->getTimeTextByItemAndField($item, 'start_time');
            $endDate = $neatline->getTimeTextByItemAndField($item, 'end_date');
            $endTime = $neatline->getTimeTextByItemAndField($item, 'end_time');

            if($startDate != '' || $startTime != '' || $endDate != '' || $endTime != '') {
                $isData = true;
            }

        break;

    }

    return $isData ? 'data-exists' : '';

}

/**
 * Parse plain text date pieces and generate a start and end timestamp
 * for timeglider.
 *
 * @param string $startDate The starting date.
 * @param string $startTime The starting time.
 * @param string $endDate The ending date.
 * @param string $endTime The ending time.
 *
 * @return array An array of the start and end timestamps.
 */
function neatline_generateTimegliderTimestamps(
    $startDate,
    $startTime,
    $endDate,
    $endTime
)
{

    // Trim, lowercase, and get rid of commas.
    $startDate = trim(strtolower(str_replace(',', '', $startDate)));
    $startTime = trim(strtolower(str_replace(',', '', $startTime)));
    $endDate = trim(strtolower(str_replace(',', '', $endDate)));
    $endTime = trim(strtolower(str_replace(',', '', $endTime)));

    // Initiaize component arrays.
    $start = array(
        'year' => '0000',
        'month' => '01',
        'day' => '01',
        'hour' => '00',
        'minute' => '00',
        'second' => '00'
    );
    $end = array(
        'year' => '0000',
        'month' => '01',
        'day' => '01',
        'hour' => '00',
        'minute' => '00',
        'second' => '00'
    );

    // Number-to-month hash.
    $months = array(
        'january',
        'february',
        'march',
        'april',
        'may',
        'june',
        'july',
        'august',
        'september',
        'october',
        'november',
        'december'
    );

    // ~ Start Date ~

    // Try to match a single year.
    if (preg_match('/^[0-9]{4}$/', $startDate, $matches)) {
        $sYear = $matches[0];
    }

    // Try to match a month and a year.
    else if (preg_match('/^(?P<month>[A-Za-z]+)\s+(?P<year>[0-9]{4})$/', $startDate, $matches)) {
        $start['year'] = $matches['year'];
        $start['month'] = (string) (array_search($matches['month'], $months) + 1);
        if (strlen($start['month']) == 1) {
            $start['month'] = '0' . $start['month'];
        }
    }

    // Try to match a month, day, and year.
    else if (preg_match('/^(?P<month>[A-Za-z]+)\s+(?P<day>[0-9]{1,2})\s+(?P<year>[0-9]{4})$/', $startDate, $matches)) {
        $start['year'] = $matches['year'];
        $start['month'] = (string) (array_search($matches['month'], $months) + 1);
        $start['day'] = $matches['day'];
        if (strlen($start['month']) == 1) {
            $start['month'] = '0' . $start['month'];
        }
        if (strlen( $start['day']) == 1) {
             $start['day'] = '0' .  $start['day'];
        }
    }

    // ~ Start Time ~

    // Try to match a 12-hour time.
    if (preg_match('/^(?P<hour>[0-9]{1,2}):(?P<minute>[0-9]{2})\s*(?P<ampm>(am|pm))$/', $startTime, $matches)) {
        $start['minute'] = $matches['minute'];
        if ($matches['ampm'] == 'am') {
            $start['hour'] = $matches['hour'];
        } else {
            $start['hour'] = (string)((int)$matches['hour'] + 12);
        }
        if (strlen($start['hour']) == 1) {
            $start['hour'] = '0' . $start['hour'];
        }
    }

    // Try to match a 24-hour time.
    else if (preg_match('/^(?P<hour>[0-9]{1,2}):(?P<minute>[0-9]{2})$/', $startTime, $matches)) {
        $start['minute'] = $matches['minute'];
        $start['hour'] = $matches['hour'];
        if (strlen($start['hour']) == 1) {
            $start['hour'] = '0' . $start['hour'];
        }
    }


    // ~ End Date ~

    // Try to match a single year.
    if (preg_match('/^[0-9]{4}$/', $endDate, $matches)) {
        $end['year'] = $matches[0];
    }

    // Try to match a month and a year.
    else if (preg_match('/^(?P<month>[A-Za-z]+)\s+(?P<year>[0-9]{4})$/', $endDate, $matches)) {
        $end['year'] = $matches['year'];
        $end['month'] = (string) (array_search($matches['month'], $months) + 1);
        if (strlen($end['month']) == 1) {
            $end['month'] = '0' . $end['month'];
        }
    }

    // Try to match a month, day, and year.
    else if (preg_match('/^(?P<month>[A-Za-z]+)\s+(?P<day>[0-9]{1,2})\s+(?P<year>[0-9]{4})$/', $endDate, $matches)) {
        $end['year'] = $matches['year'];
        $end['month'] = (string) (array_search($matches['month'], $months) + 1);
        $end['day'] = $matches['day'];
        if (strlen($end['month']) == 1) {
            $end['month'] = '0' . $end['month'];
        }
        if (strlen($end['day']) == 1) {
            $end['day'] = '0' . $end['day'];
        }
    }

    // ~ End Time ~

    // Try to match a 12-hour time.
    if (preg_match('/^(?P<hour>[0-9]{1,2}):(?P<minute>[0-9]{2})\s*(?P<ampm>(am|pm))$/', $endTime, $matches)) {
        $end['minute'] = $matches['minute'];
        if ($matches['ampm'] == 'am') {
            $end['hour'] = $matches['hour'];
        } else {
            $end['hour'] = (string)((int)$matches['hour'] + 12);
        }
        if (strlen($end['hour']) == 1) {
            $end['hour'] = '0' . $end['hour'];
        }
    }

    // Try to match a 24-hour time.
    else if (preg_match('/^(?P<hour>[0-9]{1,2}):(?P<minute>[0-9]{2})$/', $endTime, $matches)) {
        $end['minute'] = $matches['minute'];
        $end['hour'] = $matches['hour'];
        if (strlen($end['hour']) == 1) {
            $end['hour'] = '0' . $end['hour'];
        }
    }

    // Merge into timestamps.
    $start = implode('-', array($start['year'], $start['month'], $start['day']))
        . ' ' . implode(':', array($start['hour'], $start['minute'], $start['second']));
    $end = implode('-', array($end['year'], $end['month'], $end['day']))
        . ' ' . implode(':', array($end['hour'], $end['minute'], $end['second']));

    if ($end == '0000-01-01 00:00:00') {
        $end = null;
    }

    if ($start == '0000-01-01 00:00:00') {
        $start = null;
    }

    return array($start, $end);

}
