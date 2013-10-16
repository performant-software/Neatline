<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_GetSelect extends Neatline_Case_Default
{


    /**
     * `getSelect` should select the plain-text WKT value of `coverage` when
     * a non-null value is defined.
     */
    public function testSelectCoveragesAsText()
    {

        $record = new NeatlineRecord();
        $record->coverage = 'POINT(1 1)';
        $record->save();

        // Query for the record.
        $record = $this->_records->fetchObject($this->_records->getSelect());

        // `coverage` should be selected as WKT.
        $this->assertEquals('POINT(1 1)', $record->coverage);

    }


    /**
     * `getSelect` should select NULL for `coverage` when the plain-text value
     * of the field is `POINT(0 0)`.
     */
    public function testSelectEmptyCoveragesAsNull()
    {

        $record = new NeatlineRecord();
        $record->save();

        // Query for the record.
        $record = $this->_records->fetchObject(
            $this->_records->getSelect()
        );

        // `coverage` should be NULL.
        $this->assertNull($record->coverage);

    }


    /**
     * `getSelect` should order records by `added`.
     */
    public function testOrderByAdded()
    {

        $record1 = new NeatlineRecord();
        $record2 = new NeatlineRecord();
        $record3 = new NeatlineRecord();
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for the records.
        $records = $this->_records->fetchObjects(
            $this->_records->getSelect()
        );

        // Should be in reverse chronological order.
        $this->assertEquals($record3->id, $records[0]->id);
        $this->assertEquals($record2->id, $records[1]->id);
        $this->assertEquals($record1->id, $records[2]->id);

    }


}
