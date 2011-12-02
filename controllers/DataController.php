<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Special controller to serve json assets to Neatline exhibits.
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

class Neatline_DataController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        $this->_neatlinesTable = $this->getTable('NeatlineExhibit');
        $this->_recordsTable = $this->getTable('NeatlineDataRecord');

    }

    /**
     * ~ AJAX ~
     * Get events JSON for the timeline.
     *
     * @return JSON The events array.
     */
    public function simileAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Fetch the record.
        $exhibit = $this->_neatlinesTable->find($this->_request->getParam('id'));

        // Output the JSON string.
        echo $this->_recordsTable->buildTimelineJson($exhibit);

    }

    /**
     * ~ AJAX ~
     * Get item-wkt JSON for the map.
     *
     * @return JSON The vector data.
     */
    public function openlayersAction()
    {

        // Supress the default Zend layout-sniffer functionality.
        $this->_helper->viewRenderer->setNoRender(true);

        // Get id and exhibit.
        $exhibit = $this->_neatlinesTable->find($this->_request->getParam('id'));

        // Output the JSON string.
        echo $this->_recordsTable->buildMapJson($exhibit);

    }

    /**
     * ~ AJAX ~
     * Get item list markup for the undated items block.
     *
     * @return HTML The items.
     */
    public function udiAction()
    {

        // Set the layout.
        $this->_helper->viewRenderer('udi-ajax');

        // // Get the exhibit id and statuses table.
        // $neatlineId = $this->_request->getParam('id');
        // $statusesTable = $this->getTable('NeatlineRecordStatus');
        // $neatlinesTable = $this->getTable('NeatlineNeatline');

        // // Get items, push items and Neatline record into view.
        // $this->view->items = $statusesTable->getUndatedItems($neatlineId);
        // $this->view->neatline = $neatline = $neatlinesTable->find($neatlineId);

    }

}
