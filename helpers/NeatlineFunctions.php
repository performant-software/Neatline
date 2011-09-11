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

    queue_css('neatline-admin');
    queue_css('bootstrap-excerpts');

    ?>
    <link href='http://fonts.googleapis.com/css?family=Crimson+Text:400,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>
    <?php

}

/**
 * Include the layout builder widget.
 *
 * @return void.
 */
function neatline_queueLayoutBuilderCssAndJs()
{

    queue_js('layout_builder', 'javascripts');
    queue_js('toggle_button', 'javascripts');
    queue_css('custom_ui_theme/ui.custom');

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
function neatline_buttonTo($action, $name = null, $value = 'Submit', $attribs = array(), $formName = null, $formAttribs = array(), $formWrap = true)
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

    $fieldset = '<fieldset>' . $view->formSubmit($name, $value, $attribs) . '</fieldset>';

    if ($formWrap) {
        return $view->form($formName, $formAttribs,
            '<fieldset>' . $view->formSubmit($name, $value, $attribs) . '</fieldset>');
    } else {
        return $fieldset;
    }

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
    $element->setValue($value)
        ->setDecorators(array('ViewHelper'));

    return $element;

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
 * @return void.
 */
function neatline_mapSelect()
{

    // Get the maps, split up into alphabetized buckets
    // according to the parent item.
    $bucketedMaps = neatline_getMapsForSelect();

    // Construct element.
    $mapSelect = new Zend_Form_Element_Select('map');

    foreach ($bucketedMaps as $itemName => $maps) {
        $optionsArray = array();
        foreach ($maps as $map) {
            $optionsArray[$map->id] = $map->name;
        }
        $mapSelect->setMultiOptions(array($itemName => $optionsArray));
    }

    return $mapSelect;

}

/**
 * Construct the timelines dropdown select.
 *
 * @return void.
 */
function neatline_timelineSelect()
{

    $timelines = neatline_getTimelinesForSelect();
    $timelineSelect = new Zend_Form_Element_Select('timeline');

    foreach ($timelines as $timeline) {
        $timelineSelect->addMultiOption($timeline->id, $timeline->title);
    }

    return $timelineSelect;

}

/**
 * Construct the timelines dropdown select.
 *
 * @return void.
 */
function neatline_titleInput()
{

    $neatlineTitle = new Zend_Form_Element_Text('title');
    return $neatlineTitle;

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
    $parentItemSql = "(SELECT text from `$_db->ElementText` WHERE record_id = m.item_id AND element_id = 50 LIMIT 1)";

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
 * Message that displays before uninstall confirm.
 *
 * @return string The message.
 */
function neatline_uninstallWarningMessage()
{

    return '<p><strong>Warning</strong>: Uninstalling the Neatline plugin '
         . 'will permanently delete all Neatline exhibits.';


}
