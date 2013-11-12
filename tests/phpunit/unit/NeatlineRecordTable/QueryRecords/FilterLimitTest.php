<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterLimit
    extends Neatline_Case_Default
{


    /**
     * When a `limit` and `start` values are passed, the result set should be
     * truncated to the `limit` length, starting from the `start` value.
     */
    public function testFilterLimit()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record4 = new NeatlineRecord($exhibit);
        $record5 = new NeatlineRecord($exhibit);

        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';
        $record4->added = '2004-01-01';
        $record5->added = '2005-01-01';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();
        $record5->save();

        // Records 1-2 (implicit start=0).
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'limit' => 2
        ));

        $this->assertEquals($record5->id, $result['records'][0]['id']);
        $this->assertEquals($record4->id, $result['records'][1]['id']);
        $this->assertEquals(0, $result['start']);
        $this->assertCount(2, $result['records']);

        // Records 1-2 (explicit start=0).
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'limit' => 2, 'start' => 0
        ));

        $this->assertEquals($record5->id, $result['records'][0]['id']);
        $this->assertEquals($record4->id, $result['records'][1]['id']);
        $this->assertEquals(0, $result['start']);
        $this->assertCount(2, $result['records']);

        // Records 3-4.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'limit' => 2, 'start' => 2
        ));

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals(2, $result['start']);
        $this->assertCount(2, $result['records']);

        // Record 5.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'limit' => 2, 'start' => 4
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals(4, $result['start']);
        $this->assertCount(1, $result['records']);

    }


}
