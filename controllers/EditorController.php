<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller.
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

class Neatline_EditorController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        // Get tables.
        $this->_neatlinesTable =    $this->getTable('NeatlineExhibit');
        $this->_recordsTable =      $this->getTable('NeatlineDataRecord');
        $this->_mapsTable =         $this->getTable('NeatlineMapsMap');
        $this->_timelinesTable =    $this->getTable('NeatlineTimeTimeline');
        $this->_itemsTable =        $this->getTable('Item');
        $this->_filesTable =        $this->getTable('File');
        $this->_statusesTable =     $this->getTable('NeatlineRecordStatus');

    }

    /**
     * Run the editor application.
     *
     * @return void
     */
    public function indexAction()
    {

        // Get records and shell out defaults.
        $id =                       $this->_request->getParam('id');
        $neatline =                 $this->_neatlinesTable->find($id);
        $map =                      $neatline->getMap();
        $image =                    $neatline->getImage();

        // Get Omeka taxonomies.
        $collections =              $this->getTable('Collection')->findAll();
        $tags =                     $this->getTable('Tag')->findAll();
        $types =                    $this->getTable('ItemType')->findAll();

        // Construct the data array for the exhibit.
        $neatlineData = array(
            'public' =>             false,
            'neatline' =>           $neatline,
            'dataSources' => array(
                'timeline' =>       neatline_getTimelineDataUrl($neatline->id),
                'map' =>            neatline_getMapDataUrl($neatline->id),
                'undated' =>        neatline_getUndatedItemsDataUrl($neatline->id)
            )
        );

        // Push the map into the view.
        if ($map) {

            // Instantiate the map.
            $map = new GeoserverMap_Map($map);

            // Add to the parameters array.
            $neatlineData['map'] = array(
                'boundingBox' =>    $map->boundingBox,
                'epsg' =>           $map->epsg,
                'wmsAddress' =>     $map->wmsAddress,
                'layers' =>         $map->layers
            );

        }

        // Push image data into the view.
        else if ($neatline->is_map == 1 && !is_null($neatline->image_id)) {

            // Get the image and dimensions.
            $image = $this->_filesTable->find($neatline->image_id);

            // Add the parameters array.
            $neatlineData['image'] = array(
                'record' =>         $image,
                'path' =>           $image->getWebPath(),
                'name' =>           $image->original_filename
            );

        }

        // Push records.
        $this->view->neatline =     $neatline;
        $this->view->neatlineData = $neatlineData;
        $this->view->map =          $map;
        $this->view->collections =  $collections;
        $this->view->tags =         $tags;
        $this->view->types =        $types;

    }

    /**
     * ~ AJAX ~
     * Fetch items for the browser.
     *
     * @return void
     */
    public function itemsAction()
    {

        // Set the layout.
        $this->_helper->viewRenderer('items-ajax');

        // Get parameters from the ajax request.
        $searchString =             $this->_request->getParam('search');
        $tags =                     $this->_request->getParam('tags');
        $types =                    $this->_request->getParam('types');
        $collections =              $this->_request->getParam('collections');
        $all =                      json_decode($this->_request->getParam('all'));
        $neatlineId =               $this->_request->getParam('neatline_id');

        // Push in the Neatline exhibit record.
        $neatline = $this->_neatlinesTable->find($neatlineId);
        $this->view->neatline = $neatline;

        // Get records.
        $records = $this->_recordsTable->getNeatlineRecordsByExhibit($neatline);
        $this->view->records = ($records) ? $records : array();

        // Get items.
        $this->view->items = neatline_getItemsForBrowser(
            $searchString,
            $tags,
            $types,
            $collections,
            $all
        );

    }

    /**
     * ~ AJAX ~
     * Get data for an item form.
     *
     * @return void
     */
    public function formAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get parameters from the ajax request.
        $neatlineId =               $this->_request->getParam('neatline_id');
        $itemId =                   $this->_request->getParam('item_id');
        $recordId =                 $this->_request->getParam('record_id');

        // If there is a record id, build the form from the record.
        if ($recordId != null) {

            $record = $this->_recordsTable->find($recordId);
            echo $record->buildEditFormJson();

        }

        // Otherwise, build the form from the item and exhibit.
        else {

            // Fetch the Neatline exhibit record and item record.
            $neatline = $this->_neatlinesTable->find($neatlineId);
            $item = $this->_itemsTable->find($itemId);

            // Output the JSON string.
            echo $this->_recordsTable->buildEditFormJson($item, $neatline);

        }

    }

    /**
     * ~ AJAX ~
     * Fetch items for the browser.
     *
     * @return JSON $statuses An array with the final space and time statuses
     * that result from the data commit.
     */
    public function saveAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId =                   $_post['item_id'];
        $recordId =                 $_post['record_id'];
        $neatlineId =               $_post['neatline_id'];
        $title =                    $_post['title'];
        $description =              $_post['description'];
        $startDate =                $_post['start_date'];
        $startTime =                $_post['start_time'];
        $endDate =                  $_post['end_date'];
        $endTime =                  $_post['end_time'];
        $geoCoverage =              $_post['geocoverage'];
        $vectorColor =              $_post['vector_color'];
        $spaceStatus =              (boolean) json_decode($_post['space_active']);
        $timeStatus =               (boolean) json_decode($_post['time_active']);
        $leftPercentage =           (int) $_post['left_percent'];
        $rightPercentage =          (int) $_post['right_percent'];

        // Fetch the exhibit, item, and record objects.
        $neatline = $this->_neatlinesTable->find($neatlineId);

        // If there is a record id in the post, get the record.
        if ($recordId != null) {
            $record = $this->_recordsTable->find($recordId);
        }

        // Otherwise, create a new record.
        else {
            $item = $this->_itemsTable->find($itemId);
            $record = $this->_recordsTable->createOrGetRecord($item, $neatline);
        }

        // Save the record data.
        $statuses = $this->_recordsTable->saveItemFormData(
            $record,
            $title,
            $description,
            $startDate,
            $startTime,
            $endDate,
            $endTime,
            $vectorColor,
            $leftPercentage,
            $rightPercentage,
            $geoCoverage,
            $spaceStatus,
            $timeStatus
        );

        echo json_encode(array(
            'statuses' => $statuses,
            'recordid' => $record->id
        ));

    }

    /**
     * ~ AJAX ~
     * Save changes made to record statuses.
     *
     * @return void
     */
    public function statusAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId =                   $_post['item_id'];
        $recordId =                 $_post['record_id'];
        $neatlineId =               $_post['neatline_id'];
        $spaceOrTime =              $_post['space_or_time'];
        $value =                    json_decode($_post['value']);

        // If there is a record id, get the record and update.
        if ($recordId != null) {

            $record = $this->_recordsTable->find($recordId);
            $record->setStatus($spaceOrTime, $value);
            $record->save();

        }

        // Otherwise, create a new record.
        else {

            $neatline = $this->_neatlinesTable->find($neatlineId);
            $item = $this->_itemsTable->find($itemId);

            // Save the data.
            $this->_recordsTable->saveRecordStatus(
                $item,
                $neatline,
                $spaceOrTime,
                $value
            );

        }

    }

    /**
     * ~ AJAX ~
     * Save new record display ordering.
     *
     * @return void
     */
    public function orderAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $neatlineId =               $_post['neatline_id'];
        $order =                    $_post['order'];

        // Fetch the Neatline exhibit and save the ordering.
        $neatline = $this->_neatlinesTable->find($neatlineId);
        $this->_recordsTable->saveOrder($neatline, $order);

    }

    /**
     * ~ AJAX ~
     * Save default viewport focus positions.
     *
     * @return void
     */
    public function positionsAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $neatlineId =               $_post['neatline_id'];
        $mapExtent =                $_post['map_extent'];
        $mapZoom =                  $_post['map_zoom'];
        $timelineCenter =           $_post['timeline_center'];

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($neatlineId);

        // Save.
        $neatline->saveViewportPositions(
            $mapExtent,
            $mapZoom,
            $timelineCenter
        );

    }

    /**
     * ~ AJAX ~
     * Save viewport arrangement configuration.
     *
     * @return void
     */
    public function arrangementAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $neatlineId =               (int) $_post['neatline_id'];
        $isMap =                    (int) $_post['is_map'];
        $isTimeline =               (int) $_post['is_timeline'];
        $isItems =                  (int) $_post['is_items'];
        $topElement =               $_post['top_element'];
        $itemsHorizPos =            $_post['items_h_pos'];
        $itemsVertPos =             $_post['items_v_pos'];
        $itemsHeight =              $_post['items_height'];

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($neatlineId);

        // Save.
        $neatline->saveViewportArrangement(
            $isMap,
            $isTimeline,
            $isItems,
            $topElement,
            $itemsHorizPos,
            $itemsVertPos,
            $itemsHeight
        );

        // Return the updated exhibit object.
        echo json_encode($neatline);

    }

    /**
     * ~ AJAX ~
     * Save item-specific map focusing.
     *
     * @return void
     */
    public function focusAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId =                   $_post['item_id'];
        $recordId =                 $_post['record_id'];
        $neatlineId =               $_post['neatline_id'];
        $extent =                   $_post['extent'];
        $zoom =                     $_post['zoom'];

        // If there is a record id, get the record and update.
        if ($recordId != null) {
            $record = $this->_recordsTable->find($recordId);
        }

        // Otherwise, create a new record.
        else {

            $neatline = $this->_neatlinesTable->find($neatlineId);
            $item = $this->_itemsTable->find($itemId);
            $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

            // If no existing record, create a record and default in DC values.
            if (!$record) {
                $record = new NeatlineDataRecord($item, $neatline);
            }

        }

        $record->map_bounds =       $extent;
        $record->map_zoom =         $zoom;
        $record->space_active =     1;
        $record->save();

    }

    /**
     * ~ AJAX ~
     * Construct markup for a new item row.
     *
     * @return void
     */
    public function addAction()
    {

        // Fetch the exhibit record.
        $neatlineId = (int) $this->_request->neatline_id;
        $neatline = $this->_neatlinesTable->find($neatlineId);

        // Create the new record.
        $record = new NeatlineDataRecord(null, $neatline);
        $record->save();

        // Push into the view.
        $this->view->record = $record;

    }

    /**
     * ~ AJAX ~
     * Delete a Neatline-endemic data record.
     *
     * @return void
     */
    public function deleteAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get the record and delete.
        $recordId = $_post['record_id'];
        $record = $this->_recordsTable->find($recordId);
        $record->delete();

    }

}
