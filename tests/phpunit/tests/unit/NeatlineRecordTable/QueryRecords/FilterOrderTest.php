<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterOrder
    extends Neatline_Case_Default
{


    /**
     * `order` ~ Sort the results on the provided column / direction.
     */
    public function testFilterOrder()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);

        $record1->weight = 3;
        $record2->weight = 2;
        $record3->weight = 1;
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Order on `weight`, by default ascending.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'order' => 'weight'
        ));

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record1->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

        // Order on `weight ASC`.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'order' => 'weight ASC'
        ));

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record1->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

        // Order on `weight DESC`.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'order' => 'weight DESC'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record3->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

    }


}
