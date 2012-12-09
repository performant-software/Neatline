<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Layer row tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineLayerTest extends Neatline_Test_AppTestCase
{


    /**
     * Test attribute set and get.
     *
     * @return void.
     */
    public function testAttributeAccess()
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
