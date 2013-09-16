<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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

        // Exhibit.
        // --------------------------------------------------------------------
        'exhibit'           => $exhibit->toArray(),

        // API routes.
        // --------------------------------------------------------------------
        'records_api'       => public_url('neatline/records'),
        'exhibits_api'      => url('neatline/exhibits/'.$exhibit->id),
        'items_api'         => url('items/browse'),

        // Constants.
        // --------------------------------------------------------------------
        'per_page'          => (int) get_plugin_ini('Neatline', 'per_page'),
        'styles'            => $styles->toArray(),

        // Layers.
        // --------------------------------------------------------------------
        'spatial_layers'    => nl_getLayersForExhibit($exhibit)

    ));

}
