<?php
/**
 * Base layer row tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineLayerTableTest extends Neatline_Test_AppTestCase
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
        $this->_layersTable = $this->db->getTable('NeatlineLayer');

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
        $osm = new NeatlineLayer;
        $osm->name = 'OpenStreetMap';
        $osm->save();

        // Google physical.
        $gphy = new NeatlineLayer;
        $gphy->name = 'Google Physical';
        $gphy->save();

        // Google streets.
        $gstr = new NeatlineLayer;
        $gstr->name = 'Google Streets';
        $gstr->save();

        // Google hybrid.
        $ghyb = new NeatlineLayer;
        $ghyb->name = 'Google Hybrid';
        $ghyb->save();

        // Google sattelite.
        $gsat = new NeatlineLayer;
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
        $layer = new NeatlineLayer();
        $layer->name = 'Test Layer';
        $layer->save();

        $retrievedLayer = $this->_layersTable->getLayerByName('Test Layer');
        $this->assertEquals($retrievedLayer->id, $layer->id);

    }

}
