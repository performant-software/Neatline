<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Public-facing views.
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

class Neatline_PublicController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        // Get tables.
        $this->_neatlinesTable = $this->getTable('NeatlineNeatline');
        $this->_mapsTable = $this->getTable('NeatlineMapsMap');
        $this->_timelinesTable = $this->getTable('NeatlineTimeTimeline');
        $this->_itemsTable = $this->getTable('Item');
        $this->_statusesTable = $this->getTable('NeatlineRecordStatus');

    }

    /**
     * Public-facing Neatline exhibit.
     *
     * @return void
     */
    public function showAction()
    {

        // Push the Neatline into the view.
        $id = $this->_request->getParam('id');
        $neatline = $this->_neatlinesTable->find($id);
        $this->view->neatline = $neatline;

        // Get the map and timeline records.
        $map = $neatline->getMap();
        $timeline = $neatline->getTimeline();

        // Push the map and timeline records into the view.
        if ($map) {
            $this->view->map = new GeoserverMap_Map($neatline->getMap());
        }

        if ($timeline) {
            $this->view->timeline = $neatline->getTimeline();
        }

        $collections = $this->getTable('Collection')->findAll();
        $tags = $this->getTable('Tag')->findAll();
        $types = $this->getTable('ItemType')->findAll();

        $this->view->collections = $collections;
        $this->view->tags = $tags;
        $this->view->types = $types;

    }

}
