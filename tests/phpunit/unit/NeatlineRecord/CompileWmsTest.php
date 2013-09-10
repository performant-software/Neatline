<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileWms extends Neatline_Case_Default
{


    /**
     * When a WMS address and layer are defined, `compileWms` should set
     * the generic coverage that will always be matched by extent queries
     * and flip the `is_coverage` and `is_wms` trackers to 1.
     */
    public function testWmsLayerDefined()
    {

        $record = new NeatlineRecord();
        $record->setArray(array(
            'wms_address'   => 'address',
            'wms_layers'    => 'layers'
        ));

        $record->save();

        // Should flip on `is_coverage`, `is_wms`.
        $this->assertEquals($record->is_coverage, 1);
        $this->assertEquals($record->is_wms, 1);

        // Should set generic coverage.
        $this->assertEquals($record->coverage,
            'GEOMETRYCOLLECTION(
                POINT( 9999999  9999999),
                POINT(-9999999  9999999),
                POINT(-9999999 -9999999),
                POINT( 9999999 -9999999)
            )'
        );

    }


    /**
     * When a WMS address and layer are _not_ defined, `compileWms` should
     * not make any changes to the record.
     */
    public function testWmsLayerNotDefined()
    {

        // No address or layers.
        $record = new NeatlineRecord();
        $record->save();

        $this->assertNull($record->coverage);
        $this->assertEquals($record->is_coverage, 0);
        $this->assertEquals($record->is_wms, 0);

        // Address, no layers.
        $record->wms_address = 'address';
        $record->wms_layers = null;
        $record->compileWms();

        $this->assertNull($record->coverage);
        $this->assertEquals($record->is_coverage, 0);
        $this->assertEquals($record->is_wms, 0);

        // Layers, no address.
        $record->wms_address = null;
        $record->wms_layers = 'layers';
        $record->compileWms();

        $this->assertNull($record->coverage);
        $this->assertEquals($record->is_coverage, 0);
        $this->assertEquals($record->is_wms, 0);

    }


}
