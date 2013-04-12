<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `toArrayForSave` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_ToArrayForSave extends Neatline_TestCase
{


    /**
     * `toArrayForSave` should set `is_coverage`.
     */
    public function testSetIsCoverage()
    {

        $record = new NeatlineRecord();

        $record->coverage = null;
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_coverage'], 0);

        $record->coverage = 'POINT(1 1)';
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_coverage'], 1);

    }


    /**
     * `toArrayForSave` should set `is_wms`.
     */
    public function testSetIsWms()
    {

        $record = new NeatlineRecord();

        $record->wms_address = null;
        $record->wms_layers = null;
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_wms'], 0);

        $record->wms_address = 'address';
        $record->wms_layers = null;
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_wms'], 0);

        $record->wms_address = null;
        $record->wms_layers = 'layers';
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_wms'], 0);

        $record->wms_address = 'address';
        $record->wms_layers = 'layers';
        $arr = $record->toArrayForSave();
        $this->assertEquals($arr['is_wms'], 1);

    }


}
