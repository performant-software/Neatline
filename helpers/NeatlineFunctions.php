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
 * @copyright   2011 The Board and Visitors of the University of Virginia
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
    queue_css('bootstrap.xtra.min');
    queue_css('neatline-editor');
    queue_css('neatline-fullscreen');
    queue_css('gradient-builder');
    queue_css('configure-layout');
    queue_css('configure-map');
    queue_css('configure-timeline');
    queue_css('configure-items');
    queue_css('jquery.miniColors');
    queue_css('jquery.cleditor');

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
    queue_js('editor/utilities/_fieldset_expander', 'javascripts');
    queue_js('editor/utilities/_record_slug_builder', 'javascripts');
    queue_js('editor/_constructEditor', 'javascripts');

    // Extenal libraries.
    queue_js('libraries/jquery.miniColors-0.1/jquery.miniColors.min', 'javascripts');
    queue_js('libraries/CLEditor-1.3.0/jquery.cleditor.min', 'javascripts');
    queue_js('libraries/bootstrap-twipsy', 'javascripts');

}

/**
 * Include the static files for a public-facing exhibit.
 *
 * @return void.
 */
function neatline_queueInThemeAssets()
{

    // Neatline runner.
    queue_js('_constructInThemeNeatline', 'javascripts');

    // Public-specific CSS additions.
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
 * @return void.
 */
function neatline_queueNeatlineAssets()
{

    // Core Neatline stylesheet.
    queue_css('neatline');
    queue_css('neatline-timeline');
    queue_css('jquery-ui');

    // Application classes.
    queue_js('neatline', 'javascripts');
    queue_js('neatline_map', 'javascripts');
    queue_js('neatline_timeline', 'javascripts');
    queue_js('neatline_items', 'javascripts');
    queue_js('positioner', 'javascripts/utilities');
    queue_js('scroller', 'javascripts/utilities');
    queue_js('bubbles', 'javascripts/utilities');
    queue_js('span_styler', 'javascripts/utilities');
    queue_js('_utilities', 'javascripts/libraries');
    queue_js('jquery.getscrollbarwidth', 'javascripts/libraries');

    // Vendor.
    queue_js('libraries/openlayers/OpenLayers.min', 'javascripts');
    queue_js('libraries/simile/timeline-api/timeline-api', 'javascripts');
    queue_js('libraries/taffy-min', 'javascripts');
    queue_js('libraries/underscore-min', 'javascripts');
    queue_js('libraries/moment.min', 'javascripts');
    queue_js('libraries/iso8601.min', 'javascripts');
    queue_js('libraries/raphael', 'javascripts');

    // Google fonts.
    echo __v()->partial('neatline/_fonts.php');

}

/**
 * Create a form containing a single button.
 *
 * @param string $action Form action URI.
 * @param string $name Name/id attribute for button.
 * @param string $value Button value.
 * @param array $attribs Other HTML attributes for button.
 * @param string $formName Name/id attribute for button.
 * @param array $formAttribs Other HTML attributes for button.
 * @param boolean $formWrap True if the button should be wrapped inside
 * its individual form tag.
 *
 * @return string HTML form.
 */
function neatline_buttonTo(
    $action,
    $name = null,
    $value = 'Submit',
    $attribs = array(),
    $formName = null,
    $formAttribs = array(),
    $formWrap = true,
    $fieldsetClass)
{

    $view = __v();
    if (!array_key_exists('action', $formAttribs)) {
        $formAttribs['action'] = $action;
    }
    if (!array_key_exists('method', $formAttribs)) {
        $formAttribs['method'] = 'post';
    }
    if (!array_key_exists('class', $formAttribs)) {
        $formAttribs['class'] = 'button-form';
    }

    $fieldset = '<fieldset class="' . $fieldsetClass . '">'
        . $view->formSubmit($name, $value, $attribs) . '</fieldset>';

    if ($formWrap) {
        return $view->form($formName, $formAttribs, $fieldset);
    } else {
        return $fieldset;
    }

}

/**
 * Build the delete confirm button.
 *
 * @param integer $id The exhibit id.
 *
 * @return string HTML form.
 */
function neatline_deleteConfirmForm($id)
{

    $action = neatline_getDeleteExhibitUrl($id);
    $name = 'delete-neatline';
    $value = 'Delete';
    $attribs = array('class' => 'neatline btn delete large');
    $formName = 'delete-neatline';
    $formAttribs = array('class' => 'inline', 'action' => $action);
    $fieldsetClass = 'neatline-inline';

    $view = __v();
    if (!array_key_exists('method', $formAttribs)) {
        $formAttribs['method'] = 'post';
    }

    $fieldset = '<fieldset class="' . $fieldsetClass . '">'
        . $view->formSubmit($name, $value, $attribs)
        . '</fieldset>'
        . $view->formHidden('confirmed', 'confirmed');

    $form = $view->form($formName, $formAttribs, $fieldset);

    return $form;

}

/**
 * Create a hidden element.
 *
 * @param string $name The name attribute.
 * @param string $value The value attribute.
 *
 * @return string HTML form.
 */
function neatline_hiddenElement($name, $value)
{

    $element = new Zend_Form_Element_Hidden($name);
    $element->setValue($value)->setDecorators(array('ViewHelper'));

    return $element;

}

/**
 * Build link to Neatline exhibit.
 *
 * @param Omeka_record $neatline The Neatline.
 *
 * @return string The link.
 */
function neatline_linkToNeatline($neatline)
{

    $uri = uri('neatline-exhibits/editor/' . $neatline->id);

    return '<a class="neatline-title" href="' . $uri . '">' . $neatline->name . '</a>';

}

/**
 * Build link to the map.
 *
 * @param Omeka_record $neatline The exhibit.
 *
 * @return string The link.
 */
function neatline_linkToMap($neatline)
{

    // If there is a map.
    if (!is_null($neatline->map_id)) {

        $map = $neatline->getMap();

        $uri = uri('neatline-maps/maps/' . $map->id . '/files');
        return '<a class="neatline"  href="' . $uri . '">' . $map->name . '</a>';

    }

    // If there is an image.
    else if (!is_null($neatline->image_id)) {

        // Get the record.
        $_db = get_db();
        $_filesTable = $_db->getTable('File');
        $image = $_filesTable->find($neatline->image_id);

        // Get the path.
        $uri = $image->getWebPath();
        return '<a class="neatline"  href="files/show/' . $neatline->image_id . '">' .
            $image->original_filename . '</a>';

    }

    // If there is no map.
    else {
        return '<span class="neatline-null">( no map )</span>';
    }

}

/**
 * Format datetime.
 *
 * @param string $date The date in datetime.
 *
 * @return string $date The formatted date.
 */
function neatline_formatDate($date)
{

    $date = new DateTime($date);
    return $date->format('F j, Y \a\t g:i a');

}

/**
 * Checks the supplied $tab parameter to see if it matches the
 * baseline $value; if so, return the 'current' CSS class.
 *
 * @param string $tab The value passed in from the view/controller.
 * @param string $value The base value to compare against.
 *
 * @return string $class The class; empty string if the element
 * should not get the 'current' class.
 */
function neatline_isCurrent($tab, $value)
{

    $class = '';

    if ($tab == $value) {
        $class = ' current';
    }

    return $class;

}

/**
 * Query for timelines.
 *
 * @return array of Omeka_records $maps The maps.
 */
function neatline_getTimelinesForSelect()
{

    $_db = get_db();
    $timelinesTable = $_db->getTable('NeatlineTimeTimeline');

    return $timelinesTable->findAll();

}

/**
 * Utility comparer function used by neatline_getMapsForSelect().
 *
 * @param object $a The first object.
 * @param object $b The second object.
 *
 * @return void.
 */
function neatline_compareObjects($a, $b)
{

    $aText = strtolower($a->name);
    $bText = strtolower($b->name);

    if ($aText == $bText) {
        return 0;
    }

    return ($aText > $bText) ? +1 : -1;

}

/**
 * Construct the timelines dropdown select.
 *
 * @param string $text The value of the input.
 *
 * @return void.
 */
function neatline_titleInput($text)
{
    $neatlineTitle = new Zend_Form_Element_Text('title');
    $neatlineTitle->setValue($text);
    return $neatlineTitle;
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
 * Get a MySql kosher timestamp.
 *
 * @return string $timestemp The timestamp.
 */
function neatline_getTimestamp()
{

    return date('Y-m-d H:i:s');

}

/**
 * Message that displays before uninstall confirm.
 *
 * @return string The message.
 */
function neatline_uninstallWarningMessage()
{

    return '<p><strong>Warning</strong>: Uninstalling the Neatline plugin '
         . 'will permanently delete all Neatline exhibits.';


}

/**
 * Message that displays before uninstall confirm.
 *
 * @return string The message.
 */
function neatline_noMapsOrTimelinesErrorMessage()
{

    return 'Before you can start a Neatline exhibit, create at least one map '
         . 'or one timeline.';


}

/**
 * Message that displays if Neatline save fails.
 *
 * @param string $title The title of the neatline.
 *
 * @return string The message.
 */
function neatline_saveFail($title)
{

    return 'There was an error - "' . $title . '" was not saved.';

}

/**
 * Message that displays if Neatline save fails.
 *
 * @param string $title The title of the neatline.
 *
 * @return string The message.
 */
function neatline_saveSucceed($title)
{

    return '"' . $title . '" was saved successfully.';

}

/**
 * Message that displays if Neatline save fails.
 *
 * @param string $title The title of the neatline.
 *
 * @return string The message.
 */
function neatline_deleteSucceed($title)
{

    return '"' . $title . '" was deleted successfully.';

}

/**
 * Construct an error message in a form.
 *
 * @param string $text The error text.
 *
 * @return string The error markup.
 */
function neatline_error($text)
{

    return '<div class="neatline-error">'
         . $text
         . '</div>';


}

/**
 * Construct the delete exhibit action route.
 *
 * @param integer $neatline_id The id of the exhibit.
 *
 * @return string The url.
 */
function neatline_getDeleteExhibitUrl($neatline_id)
{

    return WEB_ROOT . '/admin/neatline-exhibits/delete/' . $neatline_id;

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

    return WEB_ROOT . '/neatline-exhibits/' . $neatline_id . '/data/simile';

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

    return WEB_ROOT . '/neatline-exhibits/' . $neatline_id . '/data/openlayers';

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

    return WEB_ROOT . '/neatline-exhibits/' . $neatline_id . '/data/udi';

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
 * Check to see whether an item has an active space or time record for a
 * given Neatline exhibit. If it does, return the 'checked' property for
 * the template checkbox; if not, return an empty string.
 *
 * @param Omeka_record $neatline The Neatline exhibit.
 * @param Omeka_record $item The item.
 * @param string $spaceOrTime 'space' or 'time'.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getRecordStatusForCheckBox($neatline, $item, $spaceOrTime)
{

    // Get the statuses table.
    $_db = get_db();
    $statusesTable = $_db->getTable('NeatlineRecordStatus');

    return $statusesTable
        ->checkStatus($item, $neatline, $spaceOrTime) ? 'checked' : '';

}

/**
 * Check to see whether an item has an active space or time record for a
 * given Neatline exhibit. If it does, return the 'active' class string for
 * the template checkbox; if not, return an empty string.
 *
 * @param Omeka_record $neatline The Neatline exhibit.
 * @param Omeka_record $item The item.
 * @param string $spaceOrTime 'space' or 'time'.
 *
 * @return array of Omeka_records $items The items.
 */
function neatline_getRecordStatusForIcon($neatline, $item, $spaceOrTime)
{

    // Get the statuses table.
    $_db = get_db();
    $statusesTable = $_db->getTable('NeatlineRecordStatus');

    return $statusesTable
        ->checkStatus($item, $neatline, $spaceOrTime) ? 'active' : 'inactive';

}

/**
 * Install base layers set.
 *
 * @return void.
 */
function neatline_installBaseLayers()
{

    $_db = get_db();

    // OpenStreetMaps.
    $osm = new NeatlineBaseLayer;
    $osm->name = 'OpenStreetMap';
    $osm->save();

    // Google physical.
    $gphy = new NeatlineBaseLayer;
    $gphy->name = 'Google Physical';
    $gphy->save();

    // Google streets.
    $gstr = new NeatlineBaseLayer;
    $gstr->name = 'Google Streets';
    $gstr->save();

    // Google hybrid.
    $ghyb = new NeatlineBaseLayer;
    $ghyb->name = 'Google Hybrid';
    $ghyb->save();

    // Google sattelite.
    $gsat = new NeatlineBaseLayer;
    $gsat->name = 'Google Satellite';
    $gsat->save();

    // Stamen watercolor.
    $stwc = new NeatlineBaseLayer;
    $stwc->name = 'Stamen Watercolor';
    $stwc->save();

    // Stamen toner.
    $sttn = new NeatlineBaseLayer;
    $sttn->name = 'Stamen Toner';
    $sttn->save();

    // Stamen terrain.
    $sttr = new NeatlineBaseLayer;
    $sttr->name = 'Stamen Terrain';
    $sttr->save();

}

/**
 * Set map style options.
 *
 * @return void.
 */
function neatline_setStyleDefaults()
{

    // Vector color.
    set_option('vector_color', get_plugin_ini(
        'Neatline',
        'default_vector_color'
    ));

    // Stroke color.
    set_option('stroke_color', get_plugin_ini(
        'Neatline',
        'default_stroke_color'
    ));

    // Highlight color.
    set_option('highlight_color', get_plugin_ini(
        'Neatline',
        'default_highlight_color'
    ));

    // Vector opacity.
    set_option('vector_opacity', (int) get_plugin_ini(
        'Neatline',
        'default_vector_opacity'
    ));

    // Stroke opacity.
    set_option('stroke_opacity', (int) get_plugin_ini(
        'Neatline',
        'default_stroke_opacity'
    ));

    // Stroke opacity.
    set_option('stroke_width', (int) get_plugin_ini(
        'Neatline',
        'default_stroke_width'
    ));

    // Stroke opacity.
    set_option('point_radius', (int) get_plugin_ini(
        'Neatline',
        'default_point_radius'
    ));

    // Horizontal percentage.
    set_option('h_percent', (int) get_plugin_ini(
        'Neatline',
        'default_h_percent'
    ));

    // Vertical percentage.
    set_option('v_percent', (int) get_plugin_ini(
        'Neatline',
        'default_v_percent'
    ));

    // Timeline zoom.
    set_option('timeline_zoom', (int) get_plugin_ini(
        'Neatline',
        'default_timeline_zoom'
    ));

    // Context band unit.
    set_option('context_band_unit', get_plugin_ini(
        'Neatline',
        'default_context_band_unit'
    ));

    // Context band unit.
    set_option('context_band_height', get_plugin_ini(
        'Neatline',
        'default_context_band_height'
    ));

}
