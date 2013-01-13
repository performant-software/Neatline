<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryRecords()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_QueryRecords
    extends Neatline_Test_AppTestCase
{


    /**
     * When just an exhibit record (and no filter parameters) is passed,
     * queryRecords() should fetch all of the records that belong to the
     * exhibit and emit them as an an array of associative arrays.
     */
    public function testQueryRecords()
    {

        $exhibit    = $this->__exhibit();
        $item1      = $this->__item();
        $item2      = $this->__item();
        $record1    = new NeatlineRecord($exhibit, $item1);
        $record2    = new NeatlineRecord($exhibit, $item2);

        $record1->title             = '1';
        $record2->title             = '2';
        $record1->body              = '3';
        $record2->body              = '4';
        $record1->tags              = '5';
        $record2->tags              = '6';
        $record1->slug              = '7';
        $record2->slug              = '8';
        $record1->vector_color      = '9';
        $record2->vector_color      = '10';
        $record1->stroke_color      = '11';
        $record2->stroke_color      = '12';
        $record1->select_color      = '13';
        $record2->select_color      = '14';
        $record1->vector_opacity    = 15;
        $record2->vector_opacity    = 16;
        $record1->select_opacity    = 17;
        $record2->select_opacity    = 18;
        $record1->stroke_opacity    = 19;
        $record2->stroke_opacity    = 20;
        $record1->image_opacity     = 21;
        $record2->image_opacity     = 22;
        $record1->stroke_width      = 23;
        $record2->stroke_width      = 24;
        $record1->point_radius      = 25;
        $record2->point_radius      = 26;
        $record1->point_image       = '27';
        $record2->point_image       = '28';
        $record1->min_zoom          = 29;
        $record2->min_zoom          = 30;
        $record1->max_zoom          = 31;
        $record2->max_zoom          = 32;
        $record1->map_focus         = '33';
        $record2->map_focus         = '34';
        $record1->map_zoom          = 35;
        $record2->map_zoom          = 36;
        $record1->coverage          = 'POINT(1 1)';
        $record2->coverage          = 'POINT(2 2)';

        $record1->save();
        $record2->save();

        // Query for records.
        $records = $this->_recordsTable->queryRecords($exhibit);

        // Record 1:
        $this->assertEquals($records[0]['id'],              $record1->id);
        $this->assertEquals($records[0]['item_id'],         $item1->id);
        $this->assertEquals($records[0]['title'],           '1');
        $this->assertEquals($records[0]['body'],            '3');
        $this->assertEquals($records[0]['tags'],            '5');
        $this->assertEquals($records[0]['slug'],            '7');
        $this->assertEquals($records[0]['vector_color'],    '9');
        $this->assertEquals($records[0]['stroke_color'],    '11');
        $this->assertEquals($records[0]['select_color'],    '13');
        $this->assertEquals($records[0]['vector_opacity'],  15);
        $this->assertEquals($records[0]['select_opacity'],  17);
        $this->assertEquals($records[0]['stroke_opacity'],  19);
        $this->assertEquals($records[0]['image_opacity'],   21);
        $this->assertEquals($records[0]['stroke_width'],    23);
        $this->assertEquals($records[0]['point_radius'],    25);
        $this->assertEquals($records[0]['point_image'],     '27');
        $this->assertEquals($records[0]['min_zoom'],        29);
        $this->assertEquals($records[0]['max_zoom'],        31);
        $this->assertEquals($records[0]['map_focus'],       '33');
        $this->assertEquals($records[0]['map_zoom'],        35);
        $this->assertEquals($records[0]['coverage'],        'POINT(1 1)');

        // Record 2:
        $this->assertEquals($records[1]['id'],              $record2->id);
        $this->assertEquals($records[1]['item_id'],         $item2->id);
        $this->assertEquals($records[1]['title'],           '2');
        $this->assertEquals($records[1]['body'],            '4');
        $this->assertEquals($records[1]['tags'],            '6');
        $this->assertEquals($records[1]['slug'],            '8');
        $this->assertEquals($records[1]['vector_color'],    '10');
        $this->assertEquals($records[1]['stroke_color'],    '12');
        $this->assertEquals($records[1]['select_color'],    '14');
        $this->assertEquals($records[1]['vector_opacity'],  16);
        $this->assertEquals($records[1]['select_opacity'],  18);
        $this->assertEquals($records[1]['stroke_opacity'],  20);
        $this->assertEquals($records[1]['image_opacity'],   22);
        $this->assertEquals($records[1]['stroke_width'],    24);
        $this->assertEquals($records[1]['point_radius'],    26);
        $this->assertEquals($records[1]['point_image'],     '28');
        $this->assertEquals($records[1]['min_zoom'],        30);
        $this->assertEquals($records[1]['max_zoom'],        32);
        $this->assertEquals($records[1]['map_focus'],       '34');
        $this->assertEquals($records[1]['map_zoom'],        36);
        $this->assertEquals($records[1]['coverage'],        'POINT(2 2)');

    }


    /**
     * queryRecords() should retrieve records that belong to the passed
     * exhibit. Records in other exhibits should be excluded.
     */
    public function testExhibitFilter()
    {

        $exhibit1   = $this->__exhibit();
        $exhibit2   = $this->__exhibit();
        $record1    = new NeatlineRecord($exhibit1);
        $record2    = new NeatlineRecord($exhibit1);
        $record3    = new NeatlineRecord($exhibit2);

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for exhibit1 records.
        $records = $this->_recordsTable->queryRecords($exhibit1);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);
        $this->assertCount(2, $records);

    }


    /**
     * queryRecords() should filter on zoom.
     */
    public function testZoomFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record4 = new NeatlineRecord($exhibit);

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

        // Zoom=null, get all records.
        $records = $this->_recordsTable->queryRecords($exhibit);
        $this->assertCount(4, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);
        $this->assertEquals($records[2]['id'], $record3->id);
        $this->assertEquals($records[3]['id'], $record4->id);

        // Zoom < min_zoom.
        $records = $this->_recordsTable->queryRecords($exhibit,
            null, $zoom=9);
        $this->assertCount(2, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record3->id);

        // Zoom > min_zoom.
        $records = $this->_recordsTable->queryRecords($exhibit,
            null, $zoom=16);
        $this->assertCount(2, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);

        // min_zoom < Zoom < max_zoom.
        $records = $this->_recordsTable->queryRecords($exhibit,
            null, $zoom=25);
        $this->assertCount(3, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);
        $this->assertEquals($records[2]['id'], $record4->id);

    }


    /**
     * queryRecords() should filter on extent.
     */
    public function testExtentFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POLYGON((0 0,0 2,2 2,2 0,0 0))';
        $record2->coverage = 'POLYGON((4 4,4 6,6 6,6 4,4 4))';

        $record1->save();
        $record2->save();

        // Extent=null, get all records.
        $records = $this->_recordsTable->queryRecords($exhibit);
        $this->assertCount(2, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);

        // Record1 intersection.
        $records = $this->_recordsTable->queryRecords($exhibit,
            'POLYGON((1 1,1 3,3 3,3 1,1 1))');
        $this->assertCount(1, $records);
        $this->assertEquals($records[0]['id'], $record1->id);

        // Record2 intersection.
        $records = $this->_recordsTable->queryRecords($exhibit,
            'POLYGON((5 5,5 7,7 7,7 5,5 5))');
        $this->assertCount(1, $records);
        $this->assertEquals($records[0]['id'], $record2->id);

        // Record1 and record2 intersection.
        $records = $this->_recordsTable->queryRecords($exhibit,
            'POLYGON((1 1,1 5,5 5,5 1,1 1))');
        $this->assertCount(2, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);

    }


    /**
     * When an `extent` polygon is passed to queryRecords(), records that
     * have a plaintext coverage value of `POINT(0 0)` should never be
     * returned in the result set, even when the `extent` includes the 0,0
     * point. (`POINT(0 0)` is used as a WKT "null" value that is inserted
     * automatically when a record is saved with a empty/null coverage.
     */
    public function testExtentFilterNullPointOmission()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POINT(0 0)';
        $record2->coverage = 'POINT(1 1)';

        $record1->save();
        $record2->save();

        // Record with `POINT(0 0`)` excluded.
        $records = $this->_recordsTable->queryRecords($exhibit,
            'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))');
        $this->assertCount(1, $records);
        $this->assertEquals($records[0]['id'], $record2->id);

    }


}
