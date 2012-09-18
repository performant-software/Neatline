<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Miscellaneous helpers.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


/**
 * Include the neatline-admin.css stylesheet and the Google Fonts include.
 *
 * @return void.
 */
function neatline_queueAdminCss()
{
    queue_css('neatline-admin');
}

/**
 * Include the static files for the editor.
 *
 * @return void.
 */
function neatline_queueEditorAssets()
{

    // CSS.
    queue_css('bootstrap/css/bootstrap.min');
    queue_css('neatline-editor');
    queue_css('neatline-fullscreen');
    queue_css('gradient-builder');
    queue_css('configure-layout');
    queue_css('configure-map');
    queue_css('configure-timeline');
    queue_css('configure-items');
    queue_css('jquery.miniColors');
    queue_css('redactor');

    // Application classes and controller script.
    queue_js('editor/item_browser', 'javascripts');
    queue_js('editor/item_form', 'javascripts');
    queue_js('editor/edit_geometry', 'javascripts');
    queue_js('editor/layout_builder', 'javascripts');
    queue_js('editor/items_editor', 'javascripts');
    queue_js('editor/map_editor', 'javascripts');
    queue_js('editor/configure_layout', 'javascripts');
    queue_js('editor/configure_map', 'javascripts');
    queue_js('editor/configure_timeline', 'javascripts');
    queue_js('editor/configure_items', 'javascripts');

    queue_js('editor/utilities/_toggle_button', 'javascripts');
    queue_js('editor/utilities/_gradient_builder', 'javascripts');
    queue_js('editor/utilities/_dropdown', 'javascripts');
    queue_js('editor/utilities/_integer_dragger', 'javascripts');
    queue_js('editor/_constructEditor', 'javascripts');

    // Extenal libraries.
    queue_js('libraries/jquery.miniColors-0.1/jquery.miniColors.min', 'javascripts');
    queue_js('libraries/CLEditor-1.3.0/jquery.cleditor.min', 'javascripts');
    queue_js('libraries/redactor/redactor/redactor.min', 'javascripts');
    queue_js('libraries/bootstrap.min', 'javascripts');

}

/**
 * Include the static files for a public-facing exhibit.
 *
 * @return void.
 */
function neatline_queuePublicAssets()
{

    queue_js('_constructInThemeNeatline', 'javascripts');
    queue_css('neatline-public');
    $google = 'http://maps.google.com/maps/api/js?v=3.5&sensor=false';

    // API calls.
    $headScript = __v()->headScript();
    $headScript->appendScript('', 'text/javascript', array('src' => $google));

}

/**
 * Include the fullscreen stylesheet.
 *
 * @return void.
 */
function neatline_queueFullscreenAssets()
{

    // Neatline runner.
    queue_js('_constructFullscreenNeatline', 'javascripts');
    queue_js('utilities/_fullscreen_positioner', 'javascripts');

    // Fullscreen-specific CSS.
    queue_css('neatline-fullscreen');

}

/**
 * Include the embedded stylesheet.
 *
 * @return void.
 */
function neatline_queueEmbedAssets()
{

    // Neatline runner.
    queue_js('_constructFullscreenNeatline', 'javascripts');
    queue_js('utilities/_fullscreen_positioner', 'javascripts');

    // Fullscreen-specific CSS.
    queue_css('neatline-embedded');

}

/**
 * Include the static files for the Neatline.
 *
 * @param Omeka_record $exhibit The exhibit.
 *
 * @return void.
 */
function neatline_queueNeatlineAssets($exhibit)
{

    // Core Neatline stylesheet.
    queue_css('neatline');
    queue_css('neatline-timeline');
    queue_css('neatline-jquery-ui');
    neatline_queueExhibitCss($exhibit);

    // Application classes.
    queue_js('neatline', 'javascripts/payloads');

    // Google fonts. Use prependStylesheet so it gets inserted before other
    // queued Neatline CSS files.
    $headLink = __v()->headLink();
    $headLink->prependStylesheet('http://fonts.googleapis.com/css?family=Crimson+Text:400,400italic,600,600italic,700,700italic');

}

/**
 * Try to find a CSS file that matches the exhibit slug.
 *
 * @return void.
 */
function neatline_queueExhibitCss($exhibit)
{
    try {
        queue_css($exhibit->slug);
    } catch (Exception $e) {}
}

/**
 * Construct the JSON data source url for Simile.
 *
 * @param integer $neatline_id The id of the exhibit.
 *
 * @return string The url.
 */
function neatline_getTimelineDataUrl($neatline_id)
{
    return WEB_ROOT . '/neatline-exhibits/simile/' . $neatline_id;
}

/**
 * Construct the JSON data source url for OpenLayers.
 *
 * @param integer $neatline_id The id of the exhibit.
 *
 * @return string The url.
 */
function neatline_getMapDataUrl($neatline_id)
{
    return WEB_ROOT . '/neatline-exhibits/openlayers/' . $neatline_id;
}

/**
 * Construct the HTML data source url for the undated items block.
 *
 * @param integer $neatline_id The id of the exhibit.
 *
 * @return string The url.
 */
function neatline_getUndatedItemsDataUrl($neatline_id)
{
    return WEB_ROOT . '/neatline-exhibits/udi/' . $neatline_id;
}

/**
 * Get items for the browser.
 *
 * @param NeatlineExhibit $exhibit The exhibit.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getItemsForBrowser($exhibit)
{

    $_db = get_db();
    $itemsTable = $_db->getTable('Item');
    $params = array();
    $items = array();

    // If the query is defined, fetch items.
    if (!is_null($exhibit->query)) {

        // Get query and select.
        $select = $itemsTable->getSelect();
        $query = unserialize($exhibit->query);
        $isQuery = false;

        // ** Adapted directly from Omeka_Controller_Action_Helper_SearchItems.
        foreach($query as $requestParamName => $requestParamValue) {
            if (is_string($requestParamValue) && trim($requestParamValue) == '') {
                continue;
            }
            switch($requestParamName) {
                case 'user':
                    if (is_numeric($requestParamValue)) {
                        $params['user'] = $requestParamValue;
                        $isQuery = true;
                    }
                break;

                case 'public':
                    $params['public'] = is_true($requestParamValue);
                    $isQuery = true;
                break;

                case 'featured':
                    $params['featured'] = is_true($requestParamValue);
                    $isQuery = true;
                break;

                case 'collection':
                    $params['collection'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'type':
                    $params['type'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'tag':
                case 'tags':
                    $params['tags'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'excludeTags':
                    $params['excludeTags'] = $requestParamValue;
                    $isQuery = true;
                break;

                case 'recent':
                    if (!is_true($requestParamValue)) {
                        $params['recent'] = false;
                        $isQuery = true;
                    }
                break;

                case 'search':
                    $params['search'] = $requestParamValue;
                    $isQuery = true;
                    //Don't order by recent-ness if we're doing a search
                    unset($params['recent']);
                break;

                case 'advanced':
                    //We need to filter out the empty entries if any were provided
                    foreach ($requestParamValue as $k => $entry) {
                        if (empty($entry['element_id']) || empty($entry['type'])) {
                            unset($requestParamValue[$k]);
                        }
                    }
                    if (count($requestParamValue) > 0) {
                        $params['advanced_search'] = $requestParamValue;
                        $isQuery = true;
                    }
                break;

                case 'range':
                    $params['range'] = $requestParamValue;
                    $isQuery = true;
                break;
            }
        }

        if ($isQuery) { $items = $itemsTable->findBy($params); }

    }

    return $items;

}

/**
 * Return specific field for a neatline record.
 *
 * @param string
 * @param array $options
 * @param neatlines|null
 * @return string
 */
function neatline($fieldname, $options = array(), $neatline = null)
{

    $neatline = $neatline ? $neatline : get_current_neatline();

    $fieldname = strtolower($fieldname);
    $text = $neatline->$fieldname;

    if(isset($options['snippet'])) {
        $text = nls2p(snippet($text, 0, (int)$options['snippet']));
    }

    return $text;

}

/**
 * Returns the current neatline.
 *
 * @return NeatlineExhibit|null
 */
function get_current_neatline()
{
    return __v()->neatline_exhibit;
}

/**
 * Sets the current neatline.
 *
 * @param NeatlineExhibit|null
 * @return void
 */
function set_current_neatline($neatline = null)
{
    __v()->neatline_exhibit = $neatline;
}

/**
 * Sets the neatlines for loop
 *
 * @param array $neatlines
 * @return void
 */
function set_neatlines_for_loop($neatlines)
{
    __v()->neatline_exhibits = $neatlines;
}

/**
 * Get the set of neatlines for the current loop.
 *
 * @return array
 */
function get_neatlines_for_loop()
{
    return __v()->neatline_exhibits;
}

/**
 * Loops through neatlines assigned to the view.
 *
 * @return mixed
 */
function loop_neatlines()
{
    return get_loop_records(
        'neatline_exhibits', get_neatlines_for_loop(), 'set_current_neatline'
    );
}

/**
 * Determines whether there are any neatlines in the database.
 *
 * @return boolean
 */
function has_neatlines()
{
    return (total_neatlines() > 0);
}

/**
 * Determines whether there are any neatlines to loop on the view.
 *
 * @return boolean
 */
function has_neatlines_for_loop()
{
    $view = __v();
    return ($view->neatline_exhibits and count($view->neatline_exhibits));
}

/**
 * Returns the total number of neatlines in the database.
 *
 * @return integer
 */
function total_neatlines()
{
    return get_db()->getTable('NeatlineExhibits')->count();
}

/**
 * Returns a link to a Neatline exhibit.
 *
 * @param string HTML for the text of the link.
 * @param array Attributes for the link tag. (optional)
 * @param string The action for the link. Default is 'show'.
 * @param NeatlineExhibit|null
 * @return string The HTML link.
 */
function link_to_neatline(
    $text = null,
    $props = array(),
    $action = 'show',
    $neatline = null,
    $public = true)
{

    $neatline = $neatline ? $neatline : get_current_neatline();
    $text = $text ? $text : strip_formatting(neatline('title', $neatline));

    if ($action == 'show') { $slug = $neatline->slug; }
    else { $slug = $neatline->id; }

    $route = 'neatline-exhibits/' . $action . '/' . $slug;
    $uri = $public ? public_url($route) : url($route);
    $props['href'] = $uri;
    return '<a ' . _tag_attributes($props) . '>' . $text . '</a>';

}

/**
 * Returns the number of records used in a given Neatline.
 *
 * @param NeatlineExhibit|null
 * @return integer
 */
function total_records_for_neatline($neatline = null)
{
    $neatline = $neatline ? $neatline : get_current_neatline();
    return (int)$neatline->getNumberOfRecords();
}
