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

        'per_page'          => (int) get_plugin_ini('Neatline', 'per_page'),
        'styles'            => $styles->toArray(),

        // LAYERS
        // --------------------------------------------------------------------

        'spatial_layers'    => nl_getLayersForExhibit($exhibit),

        // STRINGS
        // --------------------------------------------------------------------

        'strings'           => nl_getStrings(NL_DIR.'/strings.json')

    ));

}


/**
 * Load and translate strings from `strings.json`.
 *
 * @param string $file The location of the `strings.json` file.
 * @return array An array of strings for the front-end application.
 */
function nl_getStrings($file)
{

    // Load the `strings.json` file.
    $strings = Zend_Json::decode(file_get_contents($file));

    // XXX: PHP 5.3+. Is that OK?
    // Translate the string values.
    array_walk_recursive($strings, function(&$value) {
        $value = __($value);
    });

    return $strings;

}


/**
 * Load Markdown content for editor input help modals.
 *
 * @return array An array of name => Markdown.
 */
function nl_getInputModals()
{

    $docs = array();

    // Walk all Markdown files.
    foreach (glob(NL_DIR.'/docs/html/*.html') as $file) {
        $docs[basename($file, '.html')] = file_get_contents($file);
    }

    return $docs;

}
