<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_ToArrayForSave extends Neatline_TestCase
{


    /**
     * When a coverage is defined, `toArrayForSave` should set the value
     * and flip `is_coverage` to 1.
     */
    public function testDefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        // Should set coverage.
        $record = $this->reload($record);
        $this->assertEquals($record->coverage, 'POINT(1 1)');

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 1);

    }


    /**
     * When a coverage is _not_ defined, `toArrayForSave` should set the
     * de-facto null `POINT(0 0)` value and flip `is_coverage` to 0.
     */
    public function testUndefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->save();

        // Should set null coverage.
        $record = $this->reload($record);
        $this->assertNull($record->coverage);

        // Should flip off `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 0);

    }


    /**
     * When a WMS address and layer are defined and a coverage is defined,
     * `toArrayForSave` should override the passed coverage with a special
     * geometry - four points, one in each quadrant, each with atribrarily
     * high coordinate values - that will always be matched by viewport
     * queries. `is_coverage` should be flipped on, and the `point_radius`
     * style should be set to 0 to hide the "fake" points.
     */
    public function testWmsLayerWithDefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage     = 'POINT(1 1)';
        $record->wms_address  = 'address';
        $record->wms_layers   = 'layers';
        $record->save();

        // Should set uber-coverage.
        $record = $this->reload($record);
        $this->assertEquals($record->coverage, 'GEOMETRYCOLLECTION('.
            'POINT(9999999 9999999),'.
            'POINT(-9999999 9999999),'.
            'POINT(-9999999 -9999999),'.
            'POINT(9999999 -9999999)'.
        ')');

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 1);

    }


    /**
     * When a WMS layer is defined and a coverage is _not_ defined, the
     * `is_coverage` flag should be flipped back on.
     */
    public function testWmsLayerWithUndefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->wms_address  = 'address';
        $record->wms_layers   = 'layers';
        $record->save();

        // Should set uber-coverage.
        $record = $this->reload($record);
        $this->assertEquals($record->coverage, 'GEOMETRYCOLLECTION('.
            'POINT(9999999 9999999),'.
            'POINT(-9999999 9999999),'.
            'POINT(-9999999 -9999999),'.
            'POINT(9999999 -9999999)'.
        ')');

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 1);

    }


}
