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
     * --------------------------------------------------------------------
     * When just an exhibit record (and no filter parameters) is passed,
     * queryRecords() should retrieve all of the data records that belong
     * to the exhibit and construct an array of associative arrays, one
     * for each record, that contain all of the information needed for the
     * front-end application.
     * --------------------------------------------------------------------
     */
    public function testQueryRecords()
    {

        // Create an exhibit and items.
        $exhibit = $this->__exhibit();
        $item1 = $this->__item();
        $item2 = $this->__item();

        // Create two records.
        $record1 = new NeatlineRecord($exhibit, $item1);
        $record2 = new NeatlineRecord($exhibit, $item2);

        // Fields:
        $record1->title             = '1';
        $record2->title             = '2';
        $record1->body              = '3';
        $record2->body              = '4';
        $record1->slug              = '5';
        $record2->slug              = '6';

        // Styles:
        $record1->vector_color      = '7';
        $record2->vector_color      = '8';
        $record1->stroke_color      = '9';
        $record2->stroke_color      = '10';
        $record1->select_color      = '11';
        $record2->select_color      = '12';
        $record1->vector_opacity    = 13;
        $record2->vector_opacity    = 14;
        $record1->select_opacity    = 15;
        $record2->select_opacity    = 16;
        $record1->stroke_opacity    = 17;
        $record2->stroke_opacity    = 18;
        $record1->image_opacity     = 19;
        $record2->image_opacity     = 20;
        $record1->stroke_width      = 21;
        $record2->stroke_width      = 22;
        $record1->point_radius      = 23;
        $record2->point_radius      = 24;
        $record1->point_image       = '25';
        $record2->point_image       = '26';
        $record1->min_zoom          = 27;
        $record2->min_zoom          = 28;
        $record1->max_zoom          = 29;
        $record2->max_zoom          = 30;

        // Spatial:
        $record1->map_active        = 31;
        $record2->map_active        = 32;
        $record1->map_focus         = '33';
        $record2->map_focus         = '34';
        $record1->map_zoom          = 35;
        $record2->map_zoom          = 36;
        $record1->coverage          = 'POINT(1 1)';
        $record2->coverage          = 'POINT(2 2)';

        // Save.
        $record1->save();
        $record2->save();

        // Build the record array.
        $records = $this->_recordsTable->queryRecords($exhibit);

        // Check result.
        $this->assertEquals(
            $records, array(
            array(
                'id'                => $record1->id,
                'item_id'           => $item1->id,
                'title'             => '1',
                'body'              => '3',
                'slug'              => '5',
                'vector_color'      => '7',
                'stroke_color'      => '9',
                'select_color'      => '11',
                'vector_opacity'    => 13,
                'select_opacity'    => 15,
                'stroke_opacity'    => 17,
                'image_opacity'     => 19,
                'stroke_width'      => 21,
                'point_radius'      => 23,
                'point_image'       => '25',
                'min_zoom'          => 27,
                'max_zoom'          => 29,
                'map_active'        => 31,
                'map_focus'         => '33',
                'map_zoom'          => 35,
                'coverage'          => 'POINT(1 1)'
            ),
            array(
                'id'                => $record2->id,
                'item_id'           => $item2->id,
                'title'             => '2',
                'body'              => '4',
                'slug'              => '6',
                'vector_color'      => '8',
                'stroke_color'      => '10',
                'select_color'      => '12',
                'vector_opacity'    => 14,
                'select_opacity'    => 16,
                'stroke_opacity'    => 18,
                'image_opacity'     => 20,
                'stroke_width'      => 22,
                'point_radius'      => 24,
                'point_image'       => '26',
                'min_zoom'          => 28,
                'max_zoom'          => 30,
                'map_active'        => 32,
                'map_focus'         => '34',
                'map_zoom'          => 36,
                'coverage'          => 'POINT(2 2)'
            )
            )
        );

    }


    /**
     * --------------------------------------------------------------------
     * queryRecords() should retrieve records that belong to the passed
     * exhibit. Records in other exhibits should be excluded.
     * --------------------------------------------------------------------
     */
    public function testQueryRecordsExhibitFilter()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create 3 records.
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit1);
        $record3 = new NeatlineRecord($exhibit2);

        // Save.
        $record1->save();
        $record2->save();
        $record3->save();

        // Build array for exhibit 1.
        $records = $this->_recordsTable->queryRecords($exhibit1);

        // Check count and identities.
        $this->assertCount(2, $records);
        $this->assertEquals($records[0]['id'], $record1->id);
        $this->assertEquals($records[1]['id'], $record2->id);

    }


    /**
     * --------------------------------------------------------------------
     * queryRecords() should filter on zoom.
     * --------------------------------------------------------------------
     */
    public function testQueryRecordsZoomFilter()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create 4 records.
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

        // Save.
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
     * --------------------------------------------------------------------
     * queryRecords() should filter on extent.
     * --------------------------------------------------------------------
     */
    public function testQueryRecordsExtentFilter()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create 2 records.
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POLYGON((0 0,0 2,2 2,2 0,0 0))';
        $record2->coverage = 'POLYGON((4 4,4 6,6 6,6 4,4 4))';

        // Save.
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


}
