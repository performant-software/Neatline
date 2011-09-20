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

    queue_js('admin/layout_builder', 'javascripts');
    queue_js('admin/toggle_button', 'javascripts');

}

/**
 * Include the row glosser widget.
 *
 * @return void.
 */
function neatline_queueBrowseJs()
{

    queue_js('admin/browse_gloss', 'javascripts');
    queue_js('admin/delete_confirm', 'javascripts');

}

/**
 * Include the static files for the editor.
 *
 * @return void.
 */
function neatline_queueEditorAssets()
{

    queue_css('bootstrap-1.2.0');
    queue_css('neatline-editor');

    queue_js('editor/item_browser', 'javascripts');
    queue_js('editor/item_filter', 'javascripts');
    queue_js('neatline', 'javascripts');

    ?>
    <link href='http://fonts.googleapis.com/css?family=Crimson+Text:400,400italic,600,600italic,700,700italic' rel='stylesheet' type='text/css'>
    <?php

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
 * @return string HTML form.
 */
function neatline_deleteConfirmForm()
{

    $action = '';
    $name = 'delete-neatline';
    $value = 'Delete';
    $attribs = array('class' => 'neatline btn danger large');
    $formName = 'delete-neatline';
    $formAttribs = array('class' => 'inline');
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
    $element->setValue($value)
        ->setDecorators(array('ViewHelper'));

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

    return '<a class="neatline-title" href="' . uri('neatline-exhibits/' . $neatline->id) . '">'
         . $neatline->name
         . '</a>';

}

/**
 * Build link to Neatline exhibit.
 *
 * @param Omeka_record $neatline The Neatline.
 *
 * @return string The link.
 */
function neatline_linkToMap($neatline)
{

    $map = $neatline->getMap();

    if (!$map) {
        return '<span class="neatline-null">'
             . '( no map )'
             . '</span>';
    }

    return '<a class="neatline"  href="' . uri('neatline-maps/maps/' . $map->id . '/files') . '">'
         . $map->name
         . '</a>';

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

    return '<span class="neatline-date">'
        . $date->format('F j, Y')
        . '</span>';

}

/**
 * Build link to Neatline exhibit.
 *
 * @param Omeka_record $neatline The Neatline.
 *
 * @return string The link.
 */
function neatline_linkToTimeline($neatline)
{

    $timeline = $neatline->getTimeline();

    if (!$timeline) {
        return '<span class="neatline-null">'
             . '( no timeline )'
             . '</span>';
    }

    return '<a class="neatline"  href="' . uri('neatline-time/timelines/show/' . $timeline->id) . '">'
         . $timeline->title
         . '</a>';

}

/**
 * Do pagination markup.
 *
 * @param array $pagination Array with parameters.
 *
 * @return void.
 */
function neatline_pagination($pagination, $numberOfNeatlines)
{

    if ($numberOfNeatlines > $pagination['per_page']) {

        ?>

            <div class="neatline-pagination">
                <?php echo pagination_links(array('scrolling_style' => 'All',
                'page_range' => '5',
                'partial_file' => 'index/_pagination.php',
                'page' => $pagination['current_page'],
                'per_page' => $pagination['per_page'],
                'total_results' => $pagination['total_results'])); ?>
            </div>

        <?php

    }

}

/**
 * Do the markup for the delete confirm boxes.
 *
 * @return void.
 */
function neatline_deleteConfirmMarkup()
{

?>

    <div id="neatline-cover">

        <div class="transparency"></div>

        <div id="neatline-delete-confirm" class="modal">

            <div class="modal-header"><h1>Are you sure?</h1></div>

            <div class="modal-body">
                <p>This will permanently delete the "<span class="neatline-delete-exhibit-name"></span>"
                    exhibit. Spatial and temporal metadata added by way of the Neatline interface
                    is stored at the level of the items themselves, and will be unaffected.</p>
            </div>

            <div class="modal-footer">
                    <?php echo neatline_deleteConfirmForm(); ?>
                    <?php echo neatline_buttonTo(
                        '',
                        'cancel-neatline',
                        'Cancel',
                        array('class' => 'neatline btn gray large'),
                        'edit-neatline',
                        array('class' => 'inline'),
                        true, 'neatline-inline');
                    ?>
            </div>

        </div>

    </div>

<?php

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
    $mapSelect->setMultiOptions(array('-'));

    foreach ($bucketedMaps as $itemName => $maps) {
        $optionsArray = array();
        foreach ($maps as $map) {
            $optionsArray[$map->map_id] = $map->name;
        }
        $mapSelect->setMultiOptions(array($itemName => $optionsArray));
    }

    // Set the default.
    $mapSelect->setValue($id);

    return $mapSelect;

}

/**
 * Construct the timelines dropdown select.
 *
 * @param integer $id The id of the selected map.
 *
 * @return void.
 */
function neatline_timelineSelect($id)
{

    // If no default is set, make choice 'none'.
    if ($id == null) {
        $id = 'none';
    }

    $timelines = neatline_getTimelinesForSelect();
    $timelineSelect = new Zend_Form_Element_Select('timeline');

    $timelineSelect->addMultiOption('none', '-');
    foreach ($timelines as $timeline) {
        $timelineSelect->addMultiOption($timeline->id, $timeline->title);
    }

    // Set the default value.
    $timelineSelect->setValue($id);

    return $timelineSelect;

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
