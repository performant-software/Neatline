<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Construct exhibit globals array.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return array The array of globals.
 */
function nl_globals($exhibit)
{

    // Get style defaults from `styles.ini`.
    $styles = new Zend_Config_Ini(NL_DIR.'/styles.ini');

    return array('neatline' => array(

        // EXHIBIT
        // --------------------------------------------------------------------

        'exhibit'           => $exhibit->toArray(),

        // API ENDPOINTS
        // --------------------------------------------------------------------

        'record_api'        => public_url('neatline/records'),
        'exhibit_api'       => public_url('neatline/exhibits/'.$exhibit->id),
        'item_search_api'   => public_url('items/browse'),
        'item_body_api'     => public_url('neatline/items'),

        // CONSTANTS
        // --------------------------------------------------------------------

        'wms_mime'          => get_plugin_ini('Neatline', 'wms_mime'),
        'per_page'          => (int) get_plugin_ini('Neatline', 'per_page'),
        'styles'            => $styles->toArray(),

        // LAYERS
        // --------------------------------------------------------------------

        'spatial_layers'    => nl_getLayersForExhibit($exhibit),

        // STRINGS
        // --------------------------------------------------------------------

        'strings'           => nl_getStrings(NL_DIR.'/strings.json'),

        // OPENLAYERS
        // --------------------------------------------------------------------

        'openlayers_theme'  => nl_getOpenLayersThemeDir()

    ));

}
