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
    $collections = null
)
{

    $_db = get_db();
    $itemsTable = $_db->getTable('Item');

    $select = $itemsTable->getSelect();
    $params = array();

    if ($search) {
        $params['search'] = $search;
    }

    // Apply the search string to the table class.
    $itemsTable->applySearchFilters($select, $params);

    // Construct the where clauses for types and collections.
    $typeString = implode(',', $types);
    $collectionsString = implode(',', $collections);

    // Construct the final where clause.
    if ($typesString || $collectionsString) {

        $whereClause = 'collection_id IN (' . $typeString . ')';

        if ($collectionsString != '') {
            $whereClause .= ' OR collection_id IN (' . $collectionsString . ')';
        }

        // Apply the condition.
        $select->where($whereClause);

    }

    return $itemsTable->fetchObjects($select);

}
