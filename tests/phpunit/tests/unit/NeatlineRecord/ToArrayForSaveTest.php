<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_ToArrayForSave extends Neatline_Case_Default
{


    /**
     * When a coverage is _not_ defined, `toArrayForSave` should set the de-
     * facto null `POINT(0 0)` value.
     */
    public function testUndefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->save();

        $record = $this->_reload($record);

        // Should set null coverage.
        $this->assertNull($record->coverage);

    }


    /**
     * When a coverage is defined, `toArrayForSave` should set the value.
     */
    public function testDefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        $record = $this->_reload($record);

        // Should set coverage.
        $this->assertEquals('POINT(1 1)', $record->coverage);

    }


}
