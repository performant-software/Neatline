<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineLayer.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineLayerTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set and get.
     */
    public function testFieldAccess()
    {

        // Create a record.
        $layer = new NeatlineLayer();

        // Set.
        $layer->name = 'name';
        $layer->save();

        // Re-get the exhibit object.
        $layer = $this->_layersTable->find($layer->id);

        // Get.
        $this->assertEquals($layer->name, 'name');

    }


}
