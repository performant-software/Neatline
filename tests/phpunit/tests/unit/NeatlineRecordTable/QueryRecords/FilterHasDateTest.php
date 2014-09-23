<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterHasDate
    extends Neatline_Case_Default
{


    /**
     * `hasDate` ~ Match records with start and/or end dates.
     */
    public function testFilterHasSlug()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record4 = new NeatlineRecord($exhibit);

        $record1->start_date = '2014'; // Start
        $record2->end_date   = '2015'; // End
        $record3->start_date = '2014'; // Both
        $record3->end_date   = '2015'; // Both

        $record1->added = '2004-01-01';
        $record2->added = '2003-01-01';
        $record3->added = '2002-01-01';
        $record4->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Query for `hasDate`.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'hasDate' => true
        ));

        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertEquals($result['records'][2]['id'], $record3->id);
        $this->assertCount(3, $result['records']);

    }


}
