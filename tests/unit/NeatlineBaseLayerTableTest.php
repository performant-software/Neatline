<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Base layer row tests.
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

class Neatline_NeatlineBaseLayerTableTest extends Neatline_Test_AppTestCase
{

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();

        $this->db = get_db();
        $this->_layersTable = $this->db->getTable('NeatlineBaseLayer');

    }

    /**
     * getLayersForSelect() should construct a well-formed array with the
     * layer ids and names.
     *
     * @return void.
     */
    public function testGetLayersForSelect()
    {

        // Get all existing base layer records.
        $layers = $this->_layersTable->fetchObjects(
            $this->_layersTable->getSelect()
        );

        // Delete.
        foreach($layers as $layer) {
            $layer->delete();
        }

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

        // Get layers.
        $layers = $this->_layersTable->getLayersForSelect();

        // Check length and structure.
        $this->assertEquals(5, count($layers));
        $this->assertEquals($layers[$osm->id], 'OpenStreetMap');
        $this->assertEquals($layers[$gphy->id], 'Google Physical');
        $this->assertEquals($layers[$gstr->id], 'Google Streets');
        $this->assertEquals($layers[$ghyb->id], 'Google Hybrid');
        $this->assertEquals($layers[$gsat->id], 'Google Satellite');

    }

    /**
     * getLayerByName() should retrieve the layer record with the passed
     * name.
     *
     * @return void.
     */
    public function testGetLayerByName()
    {

        // Create a base layer.
        $layer = new NeatlineBaseLayer();
        $layer->name = 'Test Layer';
        $layer->save();

        $retrievedLayer = $this->_layersTable->getLayerByName('Test Layer');
        $this->assertEquals($retrievedLayer->id, $layer->id);

    }

}
