<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterZoom
    extends Neatline_Case_Default
{


    /**
     * `queryRecords` should filter on zoom.
     */
    public function testFilterZoom()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record4 = new NeatlineRecord($exhibit);

        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';
        $record4->added = '2004-01-01';

        // Both null.
        $record1->min_zoom = null;
        $record1->max_zoom = null;

        // Min set, max null.
        $record2->min_zoom = 10;
        $record2->max_zoom = null;

        // Min null, max set.
        $record3->min_zoom = null;
        $record3->max_zoom = 15;

        // Both set.
        $record4->min_zoom = 20;
        $record4->max_zoom = 30;

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Zoom = null
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id
        ));

        $this->assertEquals($record4->id, $result['records'][0]['id']);
        $this->assertEquals($record3->id, $result['records'][1]['id']);
        $this->assertEquals($record2->id, $result['records'][2]['id']);
        $this->assertEquals($record1->id, $result['records'][3]['id']);
        $this->assertCount(4, $result['records']);

        // Zoom < min_zoom.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'zoom' => 9
        ));

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // Zoom > min_zoom.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'zoom' => 16
        ));

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // min_zoom < Zoom < max_zoom.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'zoom' => 25
        ));

        $this->assertEquals($record4->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record1->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

    }


}
