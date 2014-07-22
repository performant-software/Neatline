<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include a compiled Javascript payload.
 *
 * @param string $path The file path.
 */
function nl_queueDistJs($path)
{

    if (APPLICATION_ENV == 'production') {
        queue_js_file('dist/production/'.$path);
    }

    else try {
        queue_js_file('dist/development/'.$path);
    } catch (InvalidArgumentException $e) {
        queue_js_file('dist/production/'.$path);
    }

}


/**
 * Include a compiled CSS payload.
 *
 * @param string $path The file path.
 */
function nl_queueDistCss($path)
{

    if (APPLICATION_ENV == 'production') {
        queue_css_file('dist/production/'.$path);
    }

    else try {
        queue_css_file('dist/development/'.$path);
    } catch (InvalidArgumentException $e) {
        queue_css_file('dist/production/'.$path);
    }

}


/**
 * Include static files for the exhibit add form.
 */
function nl_queueAddForm()
{
    nl_queueDistCss('exhibit-form');
    nl_queueDistJs('ckeditor/ckeditor');
    nl_queueDistJs('add-form');
}


/**
 * Include static files for the exhibit edit form.
 */
function nl_queueEditForm()
{
    nl_queueDistCss('exhibit-form');
    nl_queueDistJs('ckeditor/ckeditor');
    nl_queueDistJs('edit-form');
}


/**
 * Include static files for the exhibit.
 *
 * @param NeatlineExhibit The exhibit.
 */
function nl_queueNeatlinePublic($exhibit)
{

    nl_queueGoogleMapsApi();
    nl_queueLiveReload();

    nl_queueDistCss('neatline-public');
    nl_queueDistJs('neatline-public');
    queue_js_file('neatline-bootstrap');

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
    nl_queueLiveReload();

    nl_queueDistCss('neatline-editor');
    nl_queueDistJs('neatline-editor');
    nl_queueDistJs('ckeditor/ckeditor');
    queue_js_file('neatline-bootstrap');

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

    // Form the theme directory path.
    $theme = "exhibits/themes/$exhibit->slug";

    try { // Include `style.css`.
        queue_css_file('style', null, false, $theme);
    } catch (Exception $e) {}

    try { // Include `script.js`.
        queue_js_file('script', $theme);
    } catch (Exception $e) {}

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
 * Include the Google Maps API.
 */
function nl_queueGoogleMapsApi()
{
    nl_appendScript('//maps.google.com/maps/api/js?sensor=false');
}


/**
 * Include the livereload script.
 */
function nl_queueLiveReload()
{
    if (APPLICATION_ENV == 'development') {
        nl_appendScript('//localhost:35729/livereload.js');
    }
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


/**
 * Get the path to the OpenLayers theme.
 *
 * @return string The theme path.
 */
function nl_getOpenLayersThemeDir()
{
    return public_url('plugins/Neatline/views/shared/images/dark/');
}
