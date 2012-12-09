<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getLayerByName()` on NeatlineLayerTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineLayerTableTest_GetLayerByName
    extends Neatline_Test_AppTestCase
{


    /**
     * getLayerByName() should get the layer record with the passed name.
     */
    public function testGetLayerByName()
    {

        // Create a base layer.
        $layer = new NeatlineLayer();
        $layer->name = 'Test Layer';
        $layer->save();

        $retrieved = $this->_layersTable->getLayerByName('Test Layer');
        $this->assertEquals($retrieved->id, $layer->id);

    }


}
