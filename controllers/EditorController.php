<?php
/**
 * Editor controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {
        $this->exhibitsTable = $this->_helper->db->getTable('NeatlineExhibit');
        $this->recordsTable = $this->_helper->db->getTable('NeatlineRecord');
        $this->layersTable = $this->_helper->db->getTable('NeatlineLayer');
        $this->itemsTable = $this->_helper->db->getTable('Item');
        $this->filesTable = $this->_helper->db->getTable('File');
    }

    /**
     * Run the editor application.
     *
     * @return void
     */
    public function indexAction()
    {

        // Get records, push to view.
        $id = $this->_request->getParam('id');
        $this->view->exhibit = $this->exhibitsTable->find($id);
        $this->view->layers = $this->layersTable->findAll();

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
        $exhibit = $this->exhibitsTable->find($exhibidId);
        $this->view->neatline = $exhibit;

        // Get records.
        $records = $this->recordsTable->searchNeatlineRecordsByExhibit(
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
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get parameters from the ajax request.
        $exhibidId =        json_decode($this->_request->getParam('exhibit_id'));
        $itemId =           json_decode($this->_request->getParam('item_id'));
        $recordId =         json_decode($this->_request->getParam('record_id'));

        // If there is a record id, build the form from the record.
        if ($recordId != null) {
            $record = $this->recordsTable->find($recordId);
            echo json_encode($record->buildEditFormJson());
        }

        // Otherwise, build the form from the item and exhibit.
        else {

            // Fetch the Neatline exhibit record and item record.
            $neatline = $this->exhibitsTable->find($exhibidId);
            $item = $this->itemsTable->find($itemId);

            // Output the JSON string.
            echo json_encode(NeatlineRecord::buildEditFormForNewRecordJson(
                $item, $neatline)
            );

        }

    }

    /**
     * ~ AJAX ~
     * Save record form data.
     *
     * @return JSON $statuses An array with the final space and time statuses
     * that result from the data commit.
     */
    public function saveAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get the post.
        $_post = $this->_request->getPost();

        // Get parameters from the ajax request.
        $itemId =                   json_decode($_post['item_id']);
        $recordId =                 json_decode($_post['record_id']);
        $exhibitId =                json_decode($_post['exhibit_id']);
        $parentRecordId =           (int) $_post['parent_record_id'];
        $title =                    $_post['title'];
        $description =              $_post['description'];
        $useDcMetadata =            (int) $_post['use_dc_metadata'];
        $showBubble =               (int) $_post['show_bubble'];
        $startDate =                $_post['start_date'];
        $endDate =                  $_post['end_date'];
        $startVisibleDate =         $_post['start_visible_date'];
        $endVisibleDate =           $_post['end_visible_date'];
        $geoCoverage =              $_post['geocoverage'];
        $vectorColor =              $_post['vector_color'];
        $strokeColor =              $_post['stroke_color'];
        $highlightColor =           $_post['highlight_color'];
        $vectorOpacity =            $_post['vector_opacity'];
        $selectOpacity =            $_post['select_opacity'];
        $strokeOpacity =            $_post['stroke_opacity'];
        $graphicOpacity =           $_post['graphic_opacity'];
        $strokeWidth =              $_post['stroke_width'];
        $pointRadius =              $_post['point_radius'];
        $pointImage =               $_post['point_image'];
        $spaceStatus =              (boolean) json_decode($_post['map_active']);
        $timeStatus =               (boolean) json_decode($_post['time_active']);
        $leftPercent =              (int) $_post['left_percent'];
        $rightPercent =             (int) $_post['right_percent'];

        // Fetch the exhibit, item, and record objects.
        $neatline = $this->exhibitsTable->find($exhibitId);

        // If there is a record id in the post, get the record.
        if ($recordId != null) {
            $record = $this->recordsTable->find($recordId);
            $newRecord = false;
        }

        // Otherwise, create a new record.
        else {
            $item = $this->itemsTable->find($itemId);
            $record = $this->recordsTable->createOrGetRecord($item, $neatline);
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
        $record->setNotEmpty('point_image', $pointImage);
        $record->setPercentages($leftPercent, $rightPercent);
        $record->setGeocoverage($geoCoverage);

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
            $record->setStyle('select_opacity', $selectOpacity);
            $record->setStyle('stroke_opacity', $strokeOpacity);
            $record->setStyle('graphic_opacity', $graphicOpacity);
            $record->setStyle('stroke_width', $strokeWidth);
            $record->setStyle('point_radius', $pointRadius);
        }

        $record->setStatus('space', $spaceStatus);
        $record->setStatus('time',  $timeStatus);

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
            'form' =>       $record->buildEditFormJson(),
            'statuses' =>   array(
                'space' =>  (bool) $record->map_active,
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
        $this->getResponse()->setHeader('Content-type', 'application/json');

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

            $record = $this->recordsTable->find($recordId);
            $record->setStatus($spaceOrTime, $value);
            $record->save();

        }

        // Otherwise, create a new record.
        else {

            $neatline = $this->exhibitsTable->find($exhibitId);
            $item = $this->itemsTable->find($itemId);

            // Save the data.
            $record = $this->recordsTable->saveRecordStatus(
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
        $neatline = $this->exhibitsTable->find($exhibitId);
        $this->recordsTable->saveOrder($neatline, $order);

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
        $mapZoom =                  (int) $_post['map_zoom'];
        $baseLayer =                $_post['map_base_layer'];
        $timelineCenter =           $_post['timeline_center'];
        $timelineZoom =             (int) $_post['timeline_zoom'];

        // Fetch the Neatline exhibit record and item record.
        $exhibit = $this->exhibitsTable->find($exhibitId);

        // Set values.
        $exhibit->map_focus = $mapCenter;
        $exhibit->map_zoom = intval($mapZoom);
        $exhibit->focus_date = $timelineCenter;
        $exhibit->timeline_zoom = $timelineZoom;
        $exhibit->setBaseLayerByName($baseLayer);
        $exhibit->save();

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
        $this->getResponse()->setHeader('Content-type', 'application/json');

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
        $exhibit = $this->exhibitsTable->find($exhibitId);

        // Set values.
        $exhibit->is_map =             $isMap;
        $exhibit->is_timeline =        $isTimeline;
        $exhibit->is_items =           $isItems;
        $exhibit->top_element =        $topElement;
        $exhibit->items_h_pos =        $itemsHorizPos;
        $exhibit->items_v_pos =        $itemsVertPos;
        $exhibit->items_height =       $itemsHeight;
        $exhibit->h_percent =          $hPercent;
        $exhibit->v_percent =          $vPercent;
        $exhibit->save();

        // Return the updated exhibit object.
        echo json_encode($exhibit);

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
            $record = $this->recordsTable->find($recordId);
        }

        // Otherwise, create a new record.
        else {

            $neatline =     $this->exhibitsTable->find($exhibitId);
            $item =         $this->itemsTable->find($itemId);
            $record =       $this->recordsTable->getRecordByItemAndExhibit($item, $neatline);

            // If no existing record, create a record and default in DC values.
            if (!$record) {
                $record = new NeatlineRecord($item, $neatline);
            }

        }

        $record->map_focus =    $center;
        $record->map_zoom =     $zoom;
        $record->map_active =   1;
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
        $selectOpacity =            (int) $_post['select_opacity'];
        $strokeOpacity =            (int) $_post['stroke_opacity'];
        $graphicOpacity =           (int) $_post['graphic_opacity'];
        $strokeWidth =              (int) $_post['stroke_width'];
        $pointRadius =              (int) $_post['point_radius'];
        $baseLayer =                (int) $_post['base_layer'];

        // Do save.
        $exhibit = $this->exhibitsTable->find($exhibitId);
        $exhibit->setStyle('vector_color', $vectorColor);
        $exhibit->setStyle('stroke_color', $strokeColor);
        $exhibit->setStyle('highlight_color', $highlightColor);
        $exhibit->setStyle('vector_opacity', $vectorOpacity);
        $exhibit->setStyle('select_opacity', $selectOpacity);
        $exhibit->setStyle('stroke_opacity', $strokeOpacity);
        $exhibit->setStyle('graphic_opacity', $graphicOpacity);
        $exhibit->setStyle('stroke_width', $strokeWidth);
        $exhibit->setStyle('point_radius', $pointRadius);
        $exhibit->base_layer = $baseLayer;
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
        $exhibit = $this->exhibitsTable->find($exhibitId);
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
        $neatline = $this->exhibitsTable->find($exhibitId);

        // Create the new record.
        $record = new NeatlineRecord(null, $neatline);
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
        $record = $this->recordsTable->find($recordId);

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
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get the post.
        $_post = $this->_request->getPost();

        // Get the record.
        $exhibitId = (int) $_post['exhibit_id'];
        $itemId = (int) $_post['item_id'];
        $recordId = (int) $_post['record_id'];
        $status = $_post['status'];

        // Get record.
        $record = $this->recordsTable->find($recordId);

        // If no record exists, create one.
        if (is_null($record)) {
            $item = $this->itemsTable->find($itemId);
            $exhibit = $this->exhibitsTable->find($exhibitId);
            $record = new NeatlineRecord($item, $exhibit);
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
        $record = $this->recordsTable->find($recordId);
        $record->delete();

    }

}
