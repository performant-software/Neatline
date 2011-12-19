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
?>

<?php

/**
 * Include the neatline-admin.css stylesheet and the Google Fonts include.
 *
 * @return void.
 */
function neatline_queueAdminCss()
{

    // Custom CSS.
    queue_css('neatline-admin');
    queue_css('bootstrap-excerpts');

    // Google fonts.
    echo __v()->partial('neatline/_fonts.php');

}

/**
 * Include the static files for the editor.
 *
 * @return void.
 */
function neatline_queueEditorAssets()
{

    // CSS.
    queue_css('neatline-editor');
    queue_css('layout-builder');
    queue_css('gradient-builder');
    queue_css('jquery.miniColors');

    // Application classes and controller script.
    queue_js('editor/item_browser', 'javascripts');
    queue_js('editor/item_filter', 'javascripts');
    queue_js('editor/item_form', 'javascripts');
    queue_js('editor/edit_geometry', 'javascripts');
    queue_js('editor/configure_layout', 'javascripts');
    queue_js('editor/layout_builder', 'javascripts');
    queue_js('editor/item_orderer', 'javascripts');

    queue_js('editor/utilities/_small_scroll', 'javascripts');
    queue_js('editor/utilities/_toggle_button', 'javascripts');
    queue_js('editor/utilities/_gradient_builder', 'javascripts');
    queue_js('editor/_constructEditor', 'javascripts');

    // 3rd party code.
    queue_js('libraries/jquery.miniColors-0.1/jquery.miniColors.min', 'javascripts');

}

/**
 * Include the static files for a public-facing exhibit.
 *
 * @return void.
 */
function neatline_queuePublicAssets()
{

    queue_js('_constructNeatline', 'javascripts');
    queue_js('fullscreen_positioner', 'javascripts');

}

/**
 * Include the static files for the Neatline.
 *
 * @return void.
 */
function neatline_queueNeatlineAssets()
{

    // Core Neatline stylesheet.
    queue_css('bootstrap.xtra.min');
    queue_css('neatline');
    queue_css('neatline-timeline');

    // Application classes.
    queue_js('neatline', 'javascripts');
    queue_js('neatline_map', 'javascripts');
    queue_js('neatline_timeline', 'javascripts');
    queue_js('neatline_items', 'javascripts');
    queue_js('span_styler', 'javascripts');
    queue_js('positioner', 'javascripts');
    queue_js('_utilities', 'javascripts/libraries');
    queue_js('jquery.getscrollbarwidth', 'javascripts/libraries');

    // 3rd party code.
    queue_js('libraries/taffy-min', 'javascripts');

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
    $attribs = array('class' => 'neatline btn danger large');
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

    return '<span class="neatline-date">' . $date->format('F j, Y') . '</span>';

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
 * Construct the maps dropdown select.
 *
 * @param integer $id The id of the selected map.
 *
 * @return void.
 */
function neatline_mapSelect($id)
{

    // If no default is set, make choice 'none'.
    if ($id == null) {
        $id = 'none';
    }

    // Get the maps, split up into alphabetized buckets
    // according to the parent item.
    $bucketedMaps = neatline_getMapsForSelect();

    // Construct element.
    $mapSelect = new Zend_Form_Element_Select('map');
    $mapSelect->addMultiOption('none', '-');

    foreach ($bucketedMaps as $itemName => $maps) {
        $optionsArray = array();
        foreach ($maps as $map) {
            $optionsArray[$map->map_id] = $map->name;
        }
        $mapSelect->addMultiOptions(array($itemName => $optionsArray));
    }

    // Set the default.
    $mapSelect->setValue($id);

    return $mapSelect;

}

/**
 * Query for maps, adding data about the parent items
 * to use while constructing the order in the drop-down.
 *
 * @return array of Omeka_records $maps The maps.
 */
function neatline_getMapsForSelect()
{

    $_db = get_db();
    $mapsTable = $_db->getTable('NeatlineMapsMap');
    $parentItemSql = "(SELECT text from `$_db->ElementText` WHERE " .
       "record_id = m.item_id AND element_id = 50 LIMIT 1)";

    $select = $mapsTable->select()
        ->from(array('m' => $_db->prefix . 'neatline_maps_maps'))
        ->joinLeft(array('i' => $_db->prefix . 'items'), 'm.item_id = i.id')
        ->columns(array('map_id' => 'm.id', 'parent_item' => $parentItemSql));

    $maps = $mapsTable->fetchObjects($select);
    $itemBuckets = array();

    // Put the maps into an associative array of structure
    // array('parent_item_name' => array($map1, $map2, ...)).
    foreach ($maps as $map) {
        if (!array_key_exists($map->parent_item, $itemBuckets)) {
            $itemBuckets[$map->parent_item] = array($map);
        } else {
            $itemBuckets[$map->parent_item][] = $map;
        }
    }

    // Sort the contents of the buckets.
    foreach ($itemBuckets as $bucket) {
        usort($bucket, 'neatline_compareObjects');
    }

    // Then sort the buckets by the name of the parent item.
    asort($itemBuckets);
    return $itemBuckets;

}

/**
 * Construct the images dropdown select.
 *
 * @param integer $id The id of the selected image.
 *
 * @return void.
 */
function neatline_imageSelect($id)
{

    // Get the images, split up into alphabetized buckets
    // according to the parent item.
    $bucketedImages = neatline_getImagesForSelect();

    // Construct element.
    $imageSelect = new Zend_Form_Element_Select('image');
    $imageSelect->addMultiOption('none', '-');

    foreach ($bucketedImages as $itemName => $images) {
        $optionsArray = array();
        foreach ($images as $image) {
            $optionsArray[$image->file_id] = $image->original_filename;
        }
        $imageSelect->addMultiOptions(array($itemName => $optionsArray));
    }

    // Set the default.
    $imageSelect->setValue($id);

    return $imageSelect;

}

/**
 * Query for images, adding data about the parent items
 * to use while constructing the order in the drop-down.
 *
 * @return array of ? $images The images.
 */
function neatline_getImagesForSelect()
{

    $_db = get_db();
    $filesTable = $_db->getTable('File');
    $parentItemSql = "(SELECT text from `$_db->ElementText` WHERE " .
       "record_id = f.item_id AND element_id = 50 LIMIT 1)";

    $select = $filesTable->select()
        ->from(array('f' => $_db->prefix . 'files'))
        ->where('mime_os LIKE "image/%"')
        ->joinLeft(array('i' => $_db->prefix . 'items'), 'f.item_id = i.id')
        ->columns(array('file_id' => 'f.id', 'parent_item' => $parentItemSql));

    $images = $filesTable->fetchObjects($select);
    $itemBuckets = array();

    // Put the images into an associative array of structure
    // array('parent_item_name' => array($image1, $image2, ...)).
    foreach ($images as $image) {
        if (!array_key_exists($image->parent_item, $itemBuckets)) {
            $itemBuckets[$image->parent_item] = array($image);
        } else {
            $itemBuckets[$mage->parent_item][] = $image;
        }
    }

    // Sort the contents of the buckets.
    foreach ($itemBuckets as $bucket) {
        usort($bucket, 'neatline_compareObjects');
    }

    // Then sort the buckets by the name of the parent item.
    asort($itemBuckets);
    return $itemBuckets;

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
function neatline_getMysqlDatetime()
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
 * Since item() is broken.
 *
 * @param Omeka_record $item The item to work on.
 * @param string $elementSet The element set.
 * @param string $elementName The element name.
 *
 * @return string $text The element text content.
 */
function neatline_getItemMetadata($item, $elementSet, $elementName)
{

    // Get the database and set the default value.
    $_db = get_db();
    $text = '';

    // Get tables.
    $elementTable = $_db->getTable('Element');
    $elementTextTable = $_db->getTable('ElementText');
    $recordTypeTable = $_db->getTable('RecordType');

    // Fetch the element record for the field.
    $element = $elementTable->findByElementSetNameAndElementName(
        $elementSet,
        $elementName
    );

    // Get the record type for Item.
    $itemTypeId = $recordTypeTable->findIdFromName('Item');

    // Try to find a text.
    $existingTexts = $elementTextTable->fetchObjects(

        $elementTextTable->getSelect()->where(
                'record_id = ' . $item->id
                . ' AND record_type_id = ' . $itemTypeId
                . ' AND element_id = ' . $element->id
            )

    );

    if ($existingTexts != null) {
        $text = $existingTexts[0]->text;
    }

    return $text;

}
