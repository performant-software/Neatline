<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getSelect()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_GetSelect
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * getSelect() should select the plain-text value of `coverage` when
     * the field is defined.
     * --------------------------------------------------------------------
     */
    public function testDefinedCoverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        // Query for the record.
        $record = $this->_recordsTable->fetchObject(
            $this->_recordsTable->getSelect()
        );

        // Coverage should be selected as plaintext.
        $this->assertEquals($record->coverage, 'POINT(1 1)');

    }


    /**
     * --------------------------------------------------------------------
     * getSelect() should select NULL for `coverage` when the plain-text
     * value of the field is `POINT(0 0)`.
     * --------------------------------------------------------------------
     */
    public function testPoint00Coverage()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(0 0)';
        $record->save();

        // Query for the record.
        $record = $this->_recordsTable->fetchObject(
            $this->_recordsTable->getSelect()
        );

        // Coverage should be null.
        $this->assertNull($record->coverage);

    }


}
