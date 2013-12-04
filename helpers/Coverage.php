<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Convert a raw coverage value to WKT.
 *
 * @param string $coverage The raw coverage.
 * @return string|null The WKT.
 */
function nl_extractWkt($coverage) {

    $wkt = null;

    // Get coverage format.
    $format = geoPHP::detectFormat($coverage);

    // Convert / reduce to WKT.
    if (in_array($format, array('wkt', 'kml'))) {
        $wkt = geoPHP::load($coverage)->out('wkt');
    }

    return $wkt;

}


/**
 * Return record coverage data from the NeatlineFeatures plugin.
 *
 * @param $record NeatlineRecord The record to get the feature for.
 * @return string|null
 */
function nl_getNeatlineFeaturesWkt($record) {

    // Halt if Features is not present.
    if (!plugin_is_active('NeatlineFeatures')) return;

    $db = get_db();

    // Get raw coverage.
    $result = $db->fetchOne(
        "SELECT geo FROM `{$db->prefix}neatline_features`
        WHERE is_map=1 AND item_id=?;",
        $record->item_id
    );

    if ($result) {

        // If KML, convert to WKT.
        if (strpos($result, '<kml') !== false) {
            $result = nl_extractWkt(trim($result));
        }

        // If WKT, implode and wrap as `GEOMETRYCOLLECTION`.
        else {
            $result = 'GEOMETRYCOLLECTION(' .
                implode(',', explode('|', $result)) .
            ')';
        }
    }

    return $result;

}
