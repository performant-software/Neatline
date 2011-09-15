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
function neatline_getItemsForBrowser()
{

    // $_db = get_db();
    // $mapsTable = $_db->getTable('NeatlineMapsMap');
    // $parentItemSql = "(SELECT text from `$_db->ElementText` WHERE record_id = m.item_id AND element_id = 50 LIMIT 1)";

    // $select = $mapsTable->select()
    //     ->from(array('m' => $_db->prefix . 'neatline_maps_maps'))
    //     ->joinLeft(array('i' => $_db->prefix . 'items'), 'm.item_id = i.id')
    //     ->columns(array('map_id' => 'm.id', 'parent_item' => $parentItemSql));

    // $maps = $mapsTable->fetchObjects($select);
    // $itemBuckets = array();

    // // Put the maps into an associative array of structure
    // // array('parent_item_name' => array($map1, $map2, ...)).
    // foreach ($maps as $map) {
    //     if (!array_key_exists($map->parent_item, $itemBuckets)) {
    //         $itemBuckets[$map->parent_item] = array($map);
    //     } else {
    //         $itemBuckets[$map->parent_item][] = $map;
    //     }
    // }

    // // Sort the contents of the buckets.
    // foreach ($itemBuckets as $bucket) {
    //     usort($bucket, 'neatline_compareObjects');
    // }

    // // Then sort the buckets by the name of the parent item.
    // asort($itemBuckets);
    // return $itemBuckets;

}
