<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Convert a KML document to a WKT string.
 *
 * @param string $kml The KML document.
 * @return string The WKT.
 */
function nl_kmlToWkt($kml) {
    return geoPHP::load($kml)->out('wkt');
}


/**
 * Returns record coverage data from the NeatlineFeatures plugin.
 *
 * @param $record NeatlineRecord The record to get the feature for.
 * @return string|null
 */
function nl_getNeatlineFeatures($record) {

    $db = get_db();

    // Get the name of the Neatline Features table name from an option,
    // if it's been set (DI for testing).

    $table = get_option('neatline_feature_table');
    if (is_null($table)) {
        $table = $db->getTable('NeatlineFeature')->getTableName();
    }

    // Check to see if the features table is present.

    $found = false;
    foreach ($db->listTables() as $t) {
        if ($t === $table) {
            $found = true;
            break;
        }
    }

    // Halt if the table is not present.

    if (!$found) return;

    try {

        // Get raw coverage.
        $result = $db->fetchOne(
            "SELECT geo FROM {$table} WHERE is_map=1 AND item_id=?;",
            $record->item_id
        );

        if (!is_null($result)) {

            // If KML, convert to WKT.
            if (strpos($result, '<kml') === 0) {
                $result = nl_kmlToWkt($result);
            }

            // If WKT, implode and wrap in `GEOMETRYCOLLECTION`.
            else {
                $result = 'GEOMETRYCOLLECTION(' .
                    implode(',', explode('|', $result)) .
                ')';
            }
        }

    } catch (Exception $e) {
        $result = null;
    }

    return $result;

}
