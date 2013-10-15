<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_ToArrayForSave extends Neatline_Case_Default
{


    /**
     * When a coverage is defined, `toArrayForSave` should set the value and
     * flip `is_coverage` to 1.
     */
    public function testDefinedRecordCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals(1, $array['is_coverage']);

        $record->save();
        $record = $this->_reload($record);

        // Should set coverage.
        $this->assertEquals('POINT(1 1)', $record->coverage);

    }


    /**
     * When an item coverage is defined, `toArrayForSave` should set the value
     * and flip `is_coverage` to 1.
     */
    public function testDefinedItemCoverage()
    {

        $record = new NeatlineRecord();
        $record->item_coverage = 'POINT(1 1)';

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals(1, $array['is_coverage']);

        $record->save();
        $record = $this->_reload($record);

        // Should set coverage.
        $this->assertEquals('POINT(1 1)', $record->item_coverage);

    }


    /**
     * When a coverage is _not_ defined, `toArrayForSave` should set the de-
     * facto null `POINT(0 0)` value and flip `is_coverage` to 0.
     */
    public function testUndefinedRecordCoverage()
    {

        $record = new NeatlineRecord();

        // Should flip off `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals(0, $array['is_coverage']);

        $record->save();
        $record = $this->_reload($record);

        // Should set null coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * When an item_coverage is _not_ defined, `toArrayForSave` should set the
     * de-facto null `POINT(0 0)` value and flip `is_coverage` to 0.
     */
    public function testUndefinedItemCoverage()
    {

        $record = new NeatlineRecord();

        // Should flip off `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals(0, $array['is_coverage']);

        $record->save();
        $record = $this->_reload($record);

        // Should set null coverage.
        $this->assertNull($record->item_coverage);

    }


}
