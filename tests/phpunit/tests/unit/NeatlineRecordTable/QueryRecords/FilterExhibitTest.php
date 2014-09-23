<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterExhibit
    extends Neatline_Case_Default
{


    /**
     * `exhibit_id` ~ Match records that belong to the exhibit with the passed
     * ID. Records in other exhibits should be excluded.
     */
    public function testFilterExhibit()
    {

        $exhibit1 = $this->_exhibit();
        $exhibit2 = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit1);
        $record3 = new NeatlineRecord($exhibit2);

        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for exhibit1 records.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit1->id
        ));

        // Exhibit2 records should be absent.
        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


}
