<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getLayersForSelect()` on NeatlineLayerTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineLayerTableTest_GetLayersForSelect
    extends Neatline_Test_AppTestCase
{


    /**
     * getLayersForSelect() should construct a well-formed array with the
     * layer ids and names.
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


}
