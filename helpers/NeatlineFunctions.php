<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Helper functions.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

/**
 * Include the neatline-admin.css stylesheet and the Google Fonts include.
 *
 * @return void.
 */
function neatline_queueAdminCss()
{

    // Custom CSS.
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
    queue_js('libraries/wysihtml5/parser_rules/advanced', 'javascripts');
    queue_js('libraries/wysihtml5/dist/wysihtml5-0.3.0.min', 'javascripts');
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
    $google = 'http://maps.google.com/maps/api/js?v=3.8&sensor=false';

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
    queue_js('neatline', 'javascripts');
    queue_js('neatline_map', 'javascripts');
    queue_js('neatline_timeline', 'javascripts');
    queue_js('neatline_items', 'javascripts');
    queue_js('positioner', 'javascripts/utilities');
    queue_js('bubbles', 'javascripts/utilities');
    queue_js('span_styler', 'javascripts/utilities');
    queue_js('_utilities', 'javascripts/libraries');
    queue_js('jquery.getscrollbarwidth', 'javascripts/libraries');

    // Vendor.
    queue_js('libraries/openlayers/OpenLayers.min', 'javascripts');
    queue_js('libraries/tile.stamen', 'javascripts');
    queue_js('libraries/simile/timeline-api/timeline-api', 'javascripts');
    queue_js('libraries/taffy-min', 'javascripts');
    queue_js('libraries/underscore-min', 'javascripts');
    queue_js('libraries/moment.min', 'javascripts');
    queue_js('libraries/iso8601.min', 'javascripts');
    queue_js('libraries/raphael', 'javascripts');

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
 * Build order clause for SQL queries.
 *
 * @param string $sort_field The column to sort on.
 * @param string $sort_dir The direction to sort.
 *
 * @return string $order The sort parameter for the query.
 */
function neatline_buildOrderClause($sort_field, $sort_dir)
{

    if (isset($sort_dir)) {
        $sort_dir = ($sort_dir == 'a') ? 'ASC' : 'DESC';
    }

    return ($sort_field != '') ?
        trim(implode(' ', array($sort_field, $sort_dir))) : '';

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
 * Message that displays before uninstall confirm.
 *
 * @return string The message.
 */
function neatline_uninstallWarningMessage()
{
    return '<p><strong>'.__('Warning').'</strong>: '
         . __('Uninstalling the Neatline plugin will permanently delete all Neatline exhibits.');
}

/**
 * Get an element text for an item by element set and element.
 *
 * @param Omeka_record $item The item.
 * @param string $elementSet The element set.
 * @param string $elementName The element name.
 *
 * @return string $text The element text content.
 */
function neatline_getItemMetadata($item, $elementSet, $elementName)
{
    $text  = '';

    if (!is_string($elementSet)) {
        $elementSet = $elementSet->name;
    }

    $texts = $item->getElementTextsByElementNameAndSetName(
        $elementName, $elementSet
    );

    if (!empty($texts)) {
        $text = $texts[0]->text;
    }

    return $text;
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

    return __v()->neatlineexhibit;

}

/**
 * Sets the current neatline.
 *
 * @param NeatlineExhibit|null
 * @return void
 */
function set_current_neatline($neatline = null)
{

    __v()->neatlineexhibit = $neatline;

}

/**
 * Sets the neatlines for loop
 *
 * @param array $neatlines
 * @return void
 */
function set_neatlines_for_loop($neatlines)
{

    __v()->neatlineexhibits = $neatlines;

}

/**
 * Get the set of neatlines for the current loop.
 *
 * @return array
 */
function get_neatlines_for_loop()
{

    return __v()->neatlineexhibits;

}

/**
 * Loops through neatlines assigned to the view.
 *
 * @return mixed
 */
function loop_neatlines()
{

    return loop_records('neatlines', get_neatlines_for_loop(), 'set_current_neatline');

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
    return ($view->neatlineexhibits and count($view->neatlineexhibits));

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

    $text = $text ? $text : strip_formatting(neatline('name', $neatline));

    if ($action == 'show') {
        $slug = $neatline->slug;
    } else {
        $slug = $neatline->id;
    }

    $route = 'neatline-exhibits/'.$action.'/'.$slug;
    $uri = $public? public_uri($route) : uri($route);
    $props['href'] = $uri;

    $html = '<a ' . _tag_attributes($props) . '>' . $text . '</a>';

    return apply_filters('link_to_neatline', $html, $text, $props, $action, $neatline);

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

