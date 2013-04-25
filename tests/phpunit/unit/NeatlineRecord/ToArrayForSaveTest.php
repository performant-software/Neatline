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

        // Should flip on `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 1);

        $record->save();
        $record = $this->reload($record);

        // Should set coverage.
        $this->assertEquals($record->coverage, 'POINT(1 1)');

    }


    /**
     * When a coverage is _not_ defined, `toArrayForSave` should set the
     * de-facto null `POINT(0 0)` value and flip `is_coverage` to 0.
     */
    public function testUndefinedCoverage()
    {

        $record = new NeatlineRecord();

        // Should flip off `is_coverage`.
        $array = $record->toArrayForSave();
        $this->assertEquals($array['is_coverage'], 0);

        $record->save();
        $record = $this->reload($record);

        // Should set null coverage.
        $this->assertNull($record->coverage);

    }


}
