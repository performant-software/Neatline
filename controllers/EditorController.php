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
        $this->_layersTable =       $this->getTable('NeatlineBaseLayer');
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
        $exhibit =                  $this->_neatlinesTable->find($id);
        $layers =                   $this->_layersTable->findAll();

        // Push records.
        $this->view->exhibit =      $exhibit;
        $this->view->layers =       $layers;

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
        $exhibidId =                $this->_request->getParam('exhibit_id');

        // Push in the Neatline exhibit record.
        $exhibit = $this->_neatlinesTable->find($exhibidId);
        $this->view->neatline = $exhibit;

        // Get records.
        $records = $this->_recordsTable->searchNeatlineRecordsByExhibit(
            $exhibit,
            $searchString
        );

        // Get items.
        $items = neatline_getItemsForBrowser($exhibit);

        // Push the records and items (empty array if false).
        $this->view->records = $records ? $records : array();
        $this->view->items = $items;

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
        $exhibidId =        json_decode($this->_request->getParam('exhibit_id'));
        $itemId =           json_decode($this->_request->getParam('item_id'));
        $recordId =         json_decode($this->_request->getParam('record_id'));

        // If there is a record id, build the form from the record.
        if ($recordId != null) {
            $record = $this->_recordsTable->find($recordId);
            echo $record->buildEditFormJson();
        }

        // Otherwise, build the form from the item and exhibit.
        else {

            // Fetch the Neatline exhibit record and item record.
            $neatline = $this->_neatlinesTable->find($exhibidId);
            $item = $this->_itemsTable->find($itemId);

            // Output the JSON string.
            echo NeatlineDataRecord::buildEditFormForNewRecordJson($item, $neatline);

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
        $itemId =                   json_decode($_post['item_id']);
        $recordId =                 json_decode($_post['record_id']);
        $exhibitId =                json_decode($_post['exhibit_id']);
        $parentRecordId =           (int) $_post['parent_record_id'];
        $title =                    $_post['title'];
        $slug =                     $_post['slug'];
        $description =              $_post['description'];
        $useDcMetadata =            $_post['use_dc_metadata'];
        $showBubble =               $_post['show_bubble'];
        $startDate =                $_post['start_date'];
        $endDate =                  $_post['end_date'];
        $startVisibleDate =         $_post['start_visible_date'];
        $endVisibleDate =           $_post['end_visible_date'];
        $geoCoverage =              $_post['geocoverage'];
        $vectorColor =              $_post['vector_color'];
        $strokeColor =              $_post['stroke_color'];
        $highlightColor =           $_post['highlight_color'];
        $vectorOpacity =            $_post['vector_opacity'];
        $strokeOpacity =            $_post['stroke_opacity'];
        $strokeWidth =              $_post['stroke_width'];
        $pointRadius =              $_post['point_radius'];
        $spaceStatus =              (boolean) json_decode($_post['space_active']);
        $timeStatus =               (boolean) json_decode($_post['time_active']);
        $leftPercent =              (int) $_post['left_percent'];
        $rightPercent =             (int) $_post['right_percent'];

        // Fetch the exhibit, item, and record objects.
        $neatline = $this->_neatlinesTable->find($exhibitId);

        // If there is a record id in the post, get the record.
        if ($recordId != null) {
            $record = $this->_recordsTable->find($recordId);
            $newRecord = false;
        }

        // Otherwise, create a new record.
        else {
            $item = $this->_itemsTable->find($itemId);
            $record = $this->_recordsTable->createOrGetRecord($item, $neatline);
            $newRecord = true;
        }

        // Capture starting time and space parameters.
        $originalCoverage = $record->geocoverage;
        $originalDate = $record->start_date;

        // Set text parameters.
        $record->setNotEmpty('title', $title);
        $record->setNotEmpty('description', $description);
        $record->setNotEmpty('start_date', $startDate);
        $record->setNotEmpty('end_date', $endDate);
        $record->setPercentages($leftPercent, $rightPercent);
        $record->setGeocoverage($geoCoverage);
        $record->setSlug($slug);

        // Set statuses.
        $record->setUseDcMetadata($useDcMetadata);
        $record->show_bubble = $showBubble;

        // Set parent record id.
        $newParent = $record->setParentRecordId($parentRecordId);

        // Set heritable values.
        if (!$newParent || $newRecord) {
            $record->setNotEmpty('start_visible_date', $startVisibleDate);
            $record->setNotEmpty('end_visible_date', $endVisibleDate);
            $record->setStyle('vector_color', $vectorColor);
            $record->setStyle('stroke_color', $strokeColor);
            $record->setStyle('highlight_color', $highlightColor);
            $record->setStyle('vector_opacity', $vectorOpacity);
            $record->setStyle('stroke_opacity', $strokeOpacity);
            $record->setStyle('stroke_width', $strokeWidth);
            $record->setStyle('point_radius', $pointRadius);
        }

        // If there is novel coverage data, flip on the status.
        if (is_null($originalCoverage) && !is_null($record->geocoverage)) {
            $record->setStatus('space', true);
        }

        // If there is novel date data, flip on the status.
        if (is_null($originalDate) && !is_null($record->start_date)) {
            $record->setStatus('time', true);
        }

        // Commit.
        $record->save();

        // Return a JSON array containing the (potentially new) record id
        // and the updated space and time status trackers.
        echo json_encode(array(
            'recordid' =>   $record->id,
            'statuses' =>   array(
                'space' =>  (bool) $record->space_active,
                'time' =>   (bool) $record->time_active
            )
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
        $exhibitId =                $_post['exhibit_id'];
        $itemId =                   $_post['item_id'];
        $recordId =                 $_post['record_id'];
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

            $neatline = $this->_neatlinesTable->find($exhibitId);
            $item = $this->_itemsTable->find($itemId);

            // Save the data.
            $record = $this->_recordsTable->saveRecordStatus(
                $item,
                $neatline,
                $spaceOrTime,
                $value
            );

        }

        echo json_encode(array('record_id' => $record->id));

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
        $exhibitId =                $_post['exhibit_id'];
        $order =                    $_post['order'];

        // Fetch the Neatline exhibit and save the ordering.
        $neatline = $this->_neatlinesTable->find($exhibitId);
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
        $exhibitId =                $_post['exhibit_id'];
        $mapCenter =                $_post['map_center'];
        $mapZoom =                  $_post['map_zoom'];
        $timelineCenter =           $_post['timeline_center'];
        $timelineZoom =             $_post['timeline_zoom'];

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($exhibitId);

        // Save.
        $neatline->saveViewportPositions(
            $mapCenter,
            $mapZoom,
            $timelineCenter,
            $timelineZoom
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
        $exhibitId =                (int) $_post['exhibit_id'];
        $isMap =                    (int) $_post['is_map'];
        $isTimeline =               (int) $_post['is_timeline'];
        $isItems =                  (int) $_post['is_items'];
        $hPercent =                 (int) $_post['h_percent'];
        $vPercent =                 (int) $_post['v_percent'];
        $topElement =               $_post['top_element'];
        $itemsHorizPos =            $_post['items_h_pos'];
        $itemsVertPos =             $_post['items_v_pos'];
        $itemsHeight =              $_post['items_height'];

        // Fetch the Neatline exhibit record and item record.
        $neatline = $this->_neatlinesTable->find($exhibitId);

        // Save.
        $neatline->saveViewportArrangement(
            $isMap,
            $isTimeline,
            $isItems,
            $topElement,
            $itemsHorizPos,
            $itemsVertPos,
            $itemsHeight,
            $hPercent,
            $vPercent
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
        $exhibitId =                $_post['exhibit_id'];
        $center =                   $_post['center'];
        $zoom =                     $_post['zoom'];

        // If there is a record id, get the record and update.
        if ($recordId != null) {
            $record = $this->_recordsTable->find($recordId);
        }

        // Otherwise, create a new record.
        else {

            $neatline =     $this->_neatlinesTable->find($exhibitId);
            $item =         $this->_itemsTable->find($itemId);
            $record =       $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

            // If no existing record, create a record and default in DC values.
            if (!$record) {
                $record = new NeatlineDataRecord($item, $neatline);
            }

        }

        $record->map_bounds =       $center;
        $record->map_zoom =         $zoom;
        $record->space_active =     1;
        $record->save();

    }

    /**
     * ~ AJAX ~
     * Save default map settings.
     *
     * @return void
     */
    public function mapsettingsAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $exhibitId =                (int) $_post['exhibit_id'];
        $vectorColor =              $_post['vector_color'];
        $strokeColor =              $_post['stroke_color'];
        $highlightColor =           $_post['highlight_color'];
        $vectorOpacity =            (int) $_post['vector_opacity'];
        $strokeOpacity =            (int) $_post['stroke_opacity'];
        $strokeWidth =              (int) $_post['stroke_width'];
        $pointRadius =              (int) $_post['point_radius'];
        $baseLayer =                (int) $_post['base_layer'];

        // Do save.
        $exhibit = $this->_neatlinesTable->find($exhibitId);
        $exhibit->setStyle('vector_color', $vectorColor);
        $exhibit->setStyle('stroke_color', $strokeColor);
        $exhibit->setStyle('highlight_color', $highlightColor);
        $exhibit->setStyle('vector_opacity', $vectorOpacity);
        $exhibit->setStyle('stroke_opacity', $strokeOpacity);
        $exhibit->setStyle('stroke_width', $strokeWidth);
        $exhibit->setStyle('point_radius', $pointRadius);
        $exhibit->default_base_layer = $baseLayer;
        $exhibit->save();

    }

    /**
     * ~ AJAX ~
     * Save default timeline settings.
     *
     * @return void
     */
    public function timelinesettingsAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $exhibitId =                (int) $_post['exhibit_id'];
        $bandActive =               (int) $_post['is_context_band'];
        $bandHeight =               (int) $_post['context_band_height'];
        $bandUnit =                 $_post['context_band_unit'];

        // Do save.
        $exhibit = $this->_neatlinesTable->find($exhibitId);
        $exhibit->is_context_band = $bandActive;
        $exhibit->setStyle('context_band_unit', $bandUnit);
        $exhibit->setStyle('context_band_height', $bandHeight);
        $exhibit->save();

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
        $exhibitId = (int) $this->_request->exhibit_id;
        $neatline = $this->_neatlinesTable->find($exhibitId);

        // Create the new record.
        $record = new NeatlineDataRecord(null, $neatline);
        $record->save();

        // Push into the view.
        $this->view->record = $record;

    }

    /**
     * ~ AJAX ~
     * Set all styles on a record to null.
     *
     * @return void
     */
    public function resetstylesAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get the record.
        $recordId = (int) $_post['record_id'];
        $record = $this->_recordsTable->find($recordId);

        // Reset.
        $record->resetStyles();
        $record->save();

    }

    /**
     * ~ AJAX ~
     * Update the "Use default item metadata" settings.
     *
     * @return void
     */
    public function dcdefaultAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get the post.
        $_post = $this->_request->getPost();

        // Get the record.
        $exhibitId = (int) $_post['exhibit_id'];
        $itemId = (int) $_post['item_id'];
        $recordId = (int) $_post['record_id'];
        $status = $_post['status'];

        // Get record.
        $record = $this->_recordsTable->find($recordId);

        // If no record exists, create one.
        if (is_null($record)) {
            $item = $this->_itemsTable->find($itemId);
            $exhibit = $this->_neatlinesTable->find($exhibitId);
            $record = new NeatlineDataRecord($item, $exhibit);
        }

        // Set status.
        $record->setUseDcMetadata($status);
        $record->save();

        // Return the new description field.
        echo $record->getDescription();

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
