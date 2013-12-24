<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include static files for the exhibit add form.
 */
function nl_queueAddForm()
{
    queue_css_file('payloads/exhibit-form');
    queue_js_file('payloads/ckeditor/ckeditor');
    queue_js_file('payloads/add-form');
}


/**
 * Include static files for the exhibit edit form.
 */
function nl_queueEditForm()
{
    queue_css_file('payloads/exhibit-form');
    queue_js_file('payloads/ckeditor/ckeditor');
    queue_js_file('payloads/edit-form');
}


/**
 * Include static files for the item import form.
 */
function nl_queueImportForm()
{
    // TODO|dev
    queue_js_file('import-items');
}


/**
 * Include static files for the exhibit.
 *
 * @param NeatlineExhibit The exhibit.
 */
function nl_queueNeatlinePublic($exhibit)
{

    nl_queueGoogleMapsApi();

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
    queue_js_file('payloads/ckeditor/ckeditor');
    queue_js_file('bootstrap');

    fire_plugin_hook('neatline_editor_static', array(
        'exhibit' => $exhibit
    ));

}


/**
 * Include static files for the exhibit fullscreen view.
 */
function nl_queueFullscreen()
{
    queue_js_file('fullscreen');
}


/**
 * Include exhibit-specific theme assets.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 */
function nl_queueExhibitTheme($exhibit)
{
    try {
        queue_css_file('style', null, false,"exhibits/themes/$exhibit->slug");
        queue_js_file('script', "exhibits/themes/$exhibit->slug");
    } catch (Exception $e) {}
}


/**
 * Include the Google Maps API.
 */
function nl_queueGoogleMapsApi()
{
    nl_appendScript('http://maps.google.com/maps/api/js?sensor=false');
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
 * Form the path to an exhibit's custom theme assets.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 * @return string The theme path.
 */
function nl_getExhibitThemeDir($exhibit)
{
    return nl_getPublicThemeDir()."/exhibits/themes/$exhibit->slug";
}


/**
 * Get the path to the `neatline` directory in the active Omeka theme.
 *
 * @return string The theme path.
 */
function nl_getPublicThemeDir()
{
    return PUBLIC_THEME_DIR.'/'.get_option('public_theme').'/neatline';
}
