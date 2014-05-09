<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileWms extends Neatline_Case_Default
{


    /**
     * When an address is defined but the layer field is empty, `is_wms`
     * should not be flipped on.
     */
    public function testSetAddress()
    {

        $record = new NeatlineRecord();

        // Address, no layers.
        $record->wms_address = 'address';
        $record->wms_layers  = null;
        $record->save();

        // Should not flip on `is_wms`.
        $this->assertEquals(0, $record->is_wms);

    }


    /**
     * When a layer string is defined but the address field is empty, `is_wms`
     * should not be flipped on.
     */
    public function testSetLayers()
    {

        $record = new NeatlineRecord();

        // Layers, no address.
        $record->wms_address = null;
        $record->wms_layers  = 'layers';
        $record->save();

        // Should not flip on `is_wms`.
        $this->assertEquals(0, $record->is_wms);

    }


    /**
     * When both an address and layer string are provided, `is_wms` should be
     * flipped on.
     */
    public function testSetAddressAndLayers()
    {

        $record = new NeatlineRecord();

        // Address and layers.
        $record->wms_address = 'address';
        $record->wms_layers  = 'layers';
        $record->save();

        // Should flip on `is_wms`.
        $this->assertEquals(1, $record->is_wms);

    }


    /**
     * When an address and layer string were previously defined, and then the
     * address is cleared, `is_wms` should be flipped off.
     */
    public function testUnsetAddress()
    {

        $record = new NeatlineRecord();

        // Address and layers.
        $record->wms_address = 'address';
        $record->wms_layers  = 'layers';
        $record->save();

        // Unset the address.
        $record->wms_address = null;
        $record->save();

        // Should flip off `is_wms`.
        $this->assertEquals(0, $record->is_wms);

    }


    /**
     * When an address and layer string were previously defined, and then the
     * layer string is cleared, `is_wms` should be flipped off.
     */
    public function testUnsetLayers()
    {

        $record = new NeatlineRecord();

        // Address and layers.
        $record->wms_address = 'address';
        $record->wms_layers  = 'layers';
        $record->save();

        // Unset the layers.
        $record->wms_layers = null;
        $record->save();

        // Should flip off `is_wms`.
        $this->assertEquals(0, $record->is_wms);

    }


    /**
     * When an address and layer string were previously defined, and then the
     * address and layer string are cleared, `is_wms` should be flipped off.
     */
    public function testUnsetAddressAndLayers()
    {

        $record = new NeatlineRecord();

        // Address and layers.
        $record->wms_address = 'address';
        $record->wms_layers  = 'layers';
        $record->save();

        // Unset both.
        $record->wms_address = null;
        $record->wms_layers  = null;
        $record->save();

        // Should flip off `is_wms`.
        $this->assertEquals(0, $record->is_wms);

    }


}
