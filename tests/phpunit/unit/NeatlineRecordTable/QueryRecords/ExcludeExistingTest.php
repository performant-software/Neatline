<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsExcludeExisting
    extends Neatline_Case_Default
{


    /**
     * When a `existing` array of record ids is passed to `queryRecords`, the
     * API should remove any records in the result set with ids in the list of
     * existing ids. Any ids in `existing` that are _not_ present in the new
     * set of records (ie, records that were present in the previous query but
     * are no longer present) should be returned as an array under a `removed`
     * key on the result envelope.
     */
    public function testExcludeExisting()
    {

        $exhibit = $this->_exhibit();
        $record1 = $this->_record($exhibit);
        $record2 = $this->_record($exhibit);
        $record3 = $this->_record($exhibit);
        $record4 = $this->_record($exhibit);

        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';
        $record3->coverage  = 'POINT(0 3)';
        $record4->coverage  = 'POINT(0 4)';
        $record1->added     = '2001-01-01';
        $record2->added     = '2002-01-01';
        $record3->added     = '2003-01-01';
        $record4->added     = '2004-01-01';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        $result = $this->_records->queryRecords(array(

            'exhibit_id' => $exhibit->id,

            // Records 1-3 already loaded.
            'existing' => array($record1->id, $record2->id, $record3->id),

            // Match records 3 and 4.
            'extent' => 'LINESTRING(0 3,0 4)'

        ));

        // Just the new record (#4) returned.
        $this->assertEquals($record4->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Records 1-2 flagged as removed.
        $this->assertEquals(array($record1->id, $record2->id),
            $result['removed']);

    }


}
