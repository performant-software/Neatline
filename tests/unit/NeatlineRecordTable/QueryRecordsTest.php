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
     * queryRecords() should construct an array of records with all
     * attributes needed for the front-end application.
     */
    public function testQueryRecords()
    {

        // Create an exhibit and items.
        $exhibit = $this->__exhibit();
        $item1 = $this->__item();
        $item2 = $this->__item();

        // Create two records.
        $record1 = new NeatlineRecord($item1, $exhibit);
        $record2 = new NeatlineRecord($item2, $exhibit);

        // Map attributes.
        $record1->title             = 'Record 1 Title';
        $record2->title             = 'Record 2 Title';
        $record1->body              = 'Record 1 body.';
        $record2->body              = 'Record 2 body.';
        $record1->slug              = 'slug-1';
        $record2->slug              = 'slug-2';
        $record1->vector_color      = '#1';
        $record2->vector_color      = '#2';
        $record1->stroke_color      = '#3';
        $record2->stroke_color      = '#4';
        $record1->select_color      = '#5';
        $record2->select_color      = '#6';
        $record1->vector_opacity    = 1;
        $record2->vector_opacity    = 2;
        $record1->select_opacity    = 3;
        $record2->select_opacity    = 4;
        $record1->stroke_opacity    = 5;
        $record2->stroke_opacity    = 6;
        $record1->image_opacity   = 7;
        $record2->image_opacity   = 8;
        $record1->stroke_width      = 9;
        $record2->stroke_width      = 10;
        $record1->point_radius      = 11;
        $record2->point_radius      = 12;
        $record1->point_image       = 'file1.png';
        $record2->point_image       = 'file2.png';
        $record1->min_zoom          = 13;
        $record2->min_zoom          = 14;
        $record1->max_zoom          = 15;
        $record2->max_zoom          = 16;
        $record1->map_active        = 1;
        $record2->map_active        = 1;
        $record1->map_focus         = 'center1';
        $record2->map_focus         = 'center2';
        $record1->map_zoom          = 17;
        $record2->map_zoom          = 18;

        // Save.
        $record1->save('POINT(1 1)');
        $record2->save('POINT(2 2)');

        // Build the record array.
        $records = $this->_recordsTable->queryRecords($exhibit);

        // Check result.
        $this->assertEquals(
            $records, array(
            array(
                'id'                => $record1->id,
                'item_id'           => $item1->id,
                'title'             => 'Record 1 Title',
                'body'              => 'Record 1 body.',
                'slug'              => 'slug-1',
                'vector_color'      => '#1',
                'stroke_color'      => '#3',
                'select_color'      => '#5',
                'vector_opacity'    => 1,
                'select_opacity'    => 3,
                'stroke_opacity'    => 5,
                'image_opacity'     => 7,
                'stroke_width'      => 9,
                'point_radius'      => 11,
                'point_image'       => 'file1.png',
                'min_zoom'          => 13,
                'max_zoom'          => 15,
                'map_focus'         => 'center1',
                'map_zoom'          => 17,
                'coverage'          => 'POINT(1 1)',
                'wmsAddress'        => null,
                'layers'            => null,
                'map_active'        => 1
            ),
            array(
                'id'                => $record2->id,
                'item_id'           => $item2->id,
                'title'             => 'Record 2 Title',
                'body'              => 'Record 2 body.',
                'slug'              => 'slug-2',
                'vector_color'      => '#2',
                'stroke_color'      => '#4',
                'select_color'      => '#6',
                'vector_opacity'    => 2,
                'select_opacity'    => 4,
                'stroke_opacity'    => 6,
                'image_opacity'     => 8,
                'stroke_width'      => 10,
                'point_radius'      => 12,
                'point_image'       => 'file2.png',
                'min_zoom'          => 14,
                'max_zoom'          => 16,
                'map_focus'         => 'center2',
                'map_zoom'          => 18,
                'coverage'          => 'POINT(2 2)',
                'wmsAddress'        => null,
                'layers'            => null,
                'map_active'        => 1
            )
            )
        );

    }


    /**
     * queryRecords() should filter on exhibit.
     */
    public function testQueryRecordsExhibitFilter()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create 3 records.
        $record1 = new NeatlineRecord(null, $exhibit1);
        $record2 = new NeatlineRecord(null, $exhibit1);
        $record3 = new NeatlineRecord(null, $exhibit2);

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
     * queryRecords() should filter on zoom.
     */
    public function testQueryRecordsZoomFilter()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create 4 records.
        $record1 = new NeatlineRecord(null, $exhibit);
        $record2 = new NeatlineRecord(null, $exhibit);
        $record3 = new NeatlineRecord(null, $exhibit);
        $record4 = new NeatlineRecord(null, $exhibit);

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
     * queryRecords() should filter on extent.
     */
    public function testQueryRecordsExtentFilter()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create 2 records.
        $record1 = new NeatlineRecord(null, $exhibit);
        $record2 = new NeatlineRecord(null, $exhibit);

        // Save.
        $record1->save('POLYGON((0 0,0 2,2 2,2 0,0 0))');
        $record2->save('POLYGON((4 4,4 6,6 6,6 4,4 4))');

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
