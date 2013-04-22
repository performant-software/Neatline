<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include static files for the exhibit form.
 */
function nl_queueExhibitForm()
{
    queue_css_file('payloads/exhibit-form');
    queue_js_file('payloads/exhibit-form');
}


/**
 * Include static files for the exhibit.
 *
 * @param NeatlineExhibit The exhibit.
 */
function nl_queueNeatlinePublic($exhibit)
{

    nl_queueGoogleMapsApi();
    nl_queueExhibitCss($exhibit);

    queue_css_file('payloads/neatline-public');
    queue_js_file('payloads/neatline-public');
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
function nl_queueNeatlineEditor($exhibit)
{

    nl_queueGoogleMapsApi();

    queue_css_file('payloads/neatline-editor');
    queue_js_file('payloads/neatline-editor');
    queue_js_file('bootstrap');

    fire_plugin_hook('neatline_editor_static', array(
        'exhibit' => $exhibit
    ));

}


/**
 * Include the Google Maps API.
 */
function nl_queueGoogleMapsApi()
{
    nl_appendScript(
        'http://maps.google.com/maps/api/js?sensor=false'
    );
}


/**
 * Append a script to the <head> tag.
 *
 * @param string $script The script location.
 */
function nl_appendScript($script)
{
    get_view()->headScript()->appendScript(
        '', 'text/javascript', array('src' => $script)
    );
}


/**
 * Try to load an exhibit-specific css file.
 *
 * @param NeatlineExhibit The exhibit.
 */
function nl_queueExhibitCss($exhibit)
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
function nl_exhibitGlobals($exhibit)
{
    return array(
        'exhibit'       => $exhibit->toArray(),
        'records_api'   => public_url('neatline/records'),
        'base_layers'   => nl_getLayersForExhibit($exhibit),
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
function nl_editorGlobals($exhibit)
{
    return array(
        'exhibits_api'  => url('neatline/exhibits/'.$exhibit->id),
        'items_api'     => url('items/browse'),
        'page_length'   => (int) get_plugin_ini('Neatline', 'page_length')
    );
}
