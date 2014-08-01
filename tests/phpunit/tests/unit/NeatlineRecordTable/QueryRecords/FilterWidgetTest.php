<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterWidget
    extends Neatline_Case_Default
{


    /**
     * `widget` ~ Match records that are activated on a widget.
     */
    public function testFilterWidget()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);

        $record1->widgets = 'Widget1';
        $record2->widgets = 'Widget1,Widget2';
        $record3->widgets = 'Widget3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for `tag1` and `tag2`.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'widget' => 'Widget1'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


}
