<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Assets helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include the Google Maps API.
 */
function _nl_mapApis()
{
    $head = get_view()->headScript();
    $head->appendScript('', 'text/javascript', array('src' =>
        'http://maps.google.com/maps/api/js?sensor=false')
    );
}


/**
 * Include static files for the exhibit.
 *
 * @param NeatlineExhibit The exhibit.
 */
function _nl_neatlineAssets($exhibit)
{

    _nl_mapApis();
    _nl_exhibitCss($exhibit);
    queue_css_file('payloads/neatline');
    queue_js_file('payloads/neatline');
    queue_js_file('bootstrap');

    fire_plugin_hook('neatline_public_static', array(
        'exhibit' => $exhibit
    ));

}


/**
 * Include static files for the editor.
 *
 * @param NeatlineExhibit The exhibit.
 */
function _nl_editorAssets($exhibit)
{

    _nl_mapApis();
    queue_css_file('payloads/editor');
    queue_js_file('payloads/ckeditor/ckeditor');
    queue_js_file('payloads/editor');
    queue_js_file('bootstrap');

    fire_plugin_hook('neatline_editor_static', array(
        'exhibit' => $exhibit
    ));

}


/**
 * Try to load an exhibit-specific css file.
 *
 * @param NeatlineExhibit The exhibit.
 */
function _nl_exhibitCss($exhibit)
{
    try {
        queue_css_file($exhibit->slug);
    } catch (Exception $e) {}
}


/**
 * Construct exhibit globals array.
 *
 * @param NeatlineExhibit The exhibit.
 * @return array The array of globals.
 */
function _nl_exhibitGlobals($exhibit)
{
    return array(
        'exhibit'       => $exhibit->toArray(),
        'records_api'   => public_url('neatline/records'),
        'base_layers'   => _nl_getLayersForExhibit($exhibit),
        'base_layer'    => $exhibit->base_layer,
        'map_zoom'      => $exhibit->map_zoom,
        'map_focus'     => $exhibit->map_focus
    );
}


/**
 * Construct editor globals array.
 *
 * @param NeatlineExhibit The exhibit.
 * @return array The array of globals.
 */
function _nl_editorGlobals($exhibit)
{
    return array(
        'exhibits_api'  => url('neatline/exhibits/'.$exhibit->id),
        'items_api'     => url('items/browse'),
        'page_length'   => (int) get_plugin_ini('Neatline', 'page_length')
    );
}
