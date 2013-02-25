<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryRecords` on `NeatlineRecordTable`.
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
     * `queryRecords` should fetch all of the records that belong to the
     * exhibit and emit them as an an array of associative arrays.
     */
    public function testQueryRecords()
    {

        $exhibit    = $this->__exhibit();
        $item1      = $this->__item();
        $item2      = $this->__item();
        $record1    = new NeatlineRecord($exhibit, $item1);
        $record2    = new NeatlineRecord($exhibit, $item2);

        //-----------------------------------------------------------------
        $record1->added             = '2001-01-01';
        $record2->added             = '2002-01-01';
        //-----------------------------------------------------------------
        $record1->title             = '1';
        $record2->title             = '2';
        //-----------------------------------------------------------------
        $record1->body              = '3';
        $record2->body              = '4';
        //-----------------------------------------------------------------
        $record1->coverage          = 'POINT(5 5)';
        $record2->coverage          = 'POINT(6 6)';
        //-----------------------------------------------------------------
        $record1->tags              = '7';
        $record2->tags              = '8';
        //-----------------------------------------------------------------
        $record1->presenter         = '9';
        $record2->presenter         = '10';
        //-----------------------------------------------------------------
        $record1->vector_color      = '11';
        $record2->vector_color      = '12';
        //-----------------------------------------------------------------
        $record1->stroke_color      = '13';
        $record2->stroke_color      = '14';
        //-----------------------------------------------------------------
        $record1->select_color      = '15';
        $record2->select_color      = '16';
        //-----------------------------------------------------------------
        $record1->vector_opacity    = 17;
        $record2->vector_opacity    = 18;
        //-----------------------------------------------------------------
        $record1->select_opacity    = 19;
        $record2->select_opacity    = 20;
        //-----------------------------------------------------------------
        $record1->stroke_opacity    = 21;
        $record2->stroke_opacity    = 22;
        //-----------------------------------------------------------------
        $record1->stroke_width      = 23;
        $record2->stroke_width      = 24;
        //-----------------------------------------------------------------
        $record1->point_radius      = 25;
        $record2->point_radius      = 26;
        //-----------------------------------------------------------------
        $record1->point_image       = '27';
        $record2->point_image       = '28';
        //-----------------------------------------------------------------
        $record1->min_zoom          = 29;
        $record2->min_zoom          = 30;
        //-----------------------------------------------------------------
        $record1->max_zoom          = 31;
        $record2->max_zoom          = 32;
        //-----------------------------------------------------------------
        $record1->map_focus         = '33';
        $record2->map_focus         = '34';
        //-----------------------------------------------------------------
        $record1->map_zoom          = 35;
        $record2->map_zoom          = 36;
        //-----------------------------------------------------------------

        $record1->save();
        $record2->save();

        // Query for records, alias `records`.
        $result = $this->_recordsTable->queryRecords($exhibit);
        $records = $result['records'];

        // `count` should equal result size.
        $this->assertEquals($result['count'], 2);

        // Record 2:
        $this->assertEquals($records[0]['id'],              $record2->id);
        $this->assertEquals($records[0]['item_id'],         $item2->id);
        $this->assertEquals($records[0]['title'],           '2');
        $this->assertEquals($records[0]['_title'],          '2');
        $this->assertEquals($records[0]['body'],            '4');
        $this->assertEquals($records[0]['_body'],           '4');
        $this->assertEquals($records[0]['coverage'],        'POINT(6 6)');
        $this->assertEquals($records[0]['tags'],            '8');
        $this->assertEquals($records[0]['presenter'],       '10');
        $this->assertEquals($records[0]['vector_color'],    '12');
        $this->assertEquals($records[0]['stroke_color'],    '14');
        $this->assertEquals($records[0]['select_color'],    '16');
        $this->assertEquals($records[0]['vector_opacity'],  18);
        $this->assertEquals($records[0]['select_opacity'],  20);
        $this->assertEquals($records[0]['stroke_opacity'],  22);
        $this->assertEquals($records[0]['stroke_width'],    24);
        $this->assertEquals($records[0]['point_radius'],    26);
        $this->assertEquals($records[0]['point_image'],     '28');
        $this->assertEquals($records[0]['min_zoom'],        30);
        $this->assertEquals($records[0]['max_zoom'],        32);
        $this->assertEquals($records[0]['map_focus'],       '34');
        $this->assertEquals($records[0]['map_zoom'],        36);

        // Record 1:
        $this->assertEquals($records[1]['id'],              $record1->id);
        $this->assertEquals($records[1]['item_id'],         $item1->id);
        $this->assertEquals($records[1]['title'],           '1');
        $this->assertEquals($records[1]['_title'],          '1');
        $this->assertEquals($records[1]['body'],            '3');
        $this->assertEquals($records[1]['_body'],           '3');
        $this->assertEquals($records[1]['coverage'],        'POINT(5 5)');
        $this->assertEquals($records[1]['tags'],            '7');
        $this->assertEquals($records[1]['presenter'],       '9');
        $this->assertEquals($records[1]['vector_color'],    '11');
        $this->assertEquals($records[1]['stroke_color'],    '13');
        $this->assertEquals($records[1]['select_color'],    '15');
        $this->assertEquals($records[1]['vector_opacity'],  17);
        $this->assertEquals($records[1]['select_opacity'],  19);
        $this->assertEquals($records[1]['stroke_opacity'],  21);
        $this->assertEquals($records[1]['stroke_width'],    23);
        $this->assertEquals($records[1]['point_radius'],    25);
        $this->assertEquals($records[1]['point_image'],     '27');
        $this->assertEquals($records[1]['min_zoom'],        29);
        $this->assertEquals($records[1]['max_zoom'],        31);
        $this->assertEquals($records[1]['map_focus'],       '33');
        $this->assertEquals($records[1]['map_zoom'],        35);

    }


    /**
     * `queryRecords` should retrieve records that belong to the passed
     * exhibit. Records in other exhibits should be excluded.
     */
    public function testExhibitFilter()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit1);
        $record3 = new NeatlineRecord($exhibit2);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for exhibit1 records.
        $result = $this->_recordsTable->queryRecords($exhibit1);

        // Exhibit2 records should be absent.
        $this->assertEquals($result['records'][0]['id'], $record2->id);
        $this->assertEquals($result['records'][1]['id'], $record1->id);
        $this->assertCount(2, $result['records']);

    }


    /**
     * `queryRecords` should filter on zoom.
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

        // Zoom = null
        $result = $this->_recordsTable->queryRecords($exhibit);
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertEquals($result['records'][2]['id'], $record3->id);
        $this->assertEquals($result['records'][3]['id'], $record4->id);
        $this->assertCount(4, $result['records']);

        // Zoom < min_zoom.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('zoom' => 9));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record3->id);
        $this->assertCount(2, $result['records']);

        // Zoom > min_zoom.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('zoom' => 16));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertCount(2, $result['records']);

        // min_zoom < Zoom < max_zoom.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('zoom' => 25));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertEquals($result['records'][2]['id'], $record4->id);
        $this->assertCount(3, $result['records']);

    }


    /**
     * `queryRecords` should filter on extent.
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
        $result = $this->_recordsTable->queryRecords($exhibit);
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertCount(2, $result['records']);

        // Record1 intersection.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('extent' => 'POLYGON((1 1,1 3,3 3,3 1,1 1))'));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertCount(1, $result['records']);

        // Record2 intersection.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('extent' => 'POLYGON((5 5,5 7,7 7,7 5,5 5))'));
        $this->assertEquals($result['records'][0]['id'], $record2->id);
        $this->assertCount(1, $result['records']);

        // Record1 and record2 intersection.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('extent' => 'POLYGON((1 1,1 5,5 5,5 1,1 1))'));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertCount(2, $result['records']);

    }


    /**
     * When an `extent` polygon is passed to `queryRecords`, records that
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
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('extent' => 'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))'));
        $this->assertEquals($result['records'][0]['id'], $record2->id);
        $this->assertCount(1, $result['records']);

    }


    /**
     * When a `limit` and `offset` values are passed to `queryRecords`,
     * the result set should be truncated to the `limit` length, starting
     * from the `offset` value.
     */
    public function testLimitFilter()
    {

        $exhibit = $this->__exhibit();
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

        // Records 1-2.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 0));
        $this->assertEquals($result['records'][0]['id'], $record5->id);
        $this->assertEquals($result['records'][1]['id'], $record4->id);
        $this->assertCount(2, $result['records']);

        // Records 3-4.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 2));
        $this->assertEquals($result['records'][0]['id'], $record3->id);
        $this->assertEquals($result['records'][1]['id'], $record2->id);
        $this->assertCount(2, $result['records']);

        // Record 5.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 4));
        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertCount(1, $result['records']);

    }


    /**
     * `queryRecords` should filter on a search query.
     */
    public function testKeywordsFilter()
    {

        $exhibit = $this->__exhibit();

        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';
        $record1->title = '1 neatline 2';
        $record2->body  = '3 neatline 4';
        $record3->body  = 'omeka';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for 'neatline'.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('query' => 'neatline'));
        $this->assertEquals($result['records'][0]['id'], $record2->id);
        $this->assertEquals($result['records'][1]['id'], $record1->id);
        $this->assertCount(2, $result['records']);

    }


    /**
     * `queryRecords` should filter on a tags query.
     */
    public function testTagsFilter()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag1, tag2';
        $record3->tags = 'tag3';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for tag1 and tag2.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('tags' => array('tag1', 'tag2')));
        $this->assertEquals($result['records'][0]['id'], $record2->id);
        $this->assertCount(1, $result['records']);

    }


    /**
     * When a `limit` and `offset` values are passed to `queryRecords`,
     * the result set should include a `count` key with the original size
     * of the result set before the limit was applied.
     */
    public function testTotalRecordCount()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);
        $record3 = $this->__record($exhibit);

        // Limit to two records.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 0));
        $this->assertEquals($result['count'], 3);

    }


    /**
     * When an `offset` key is not included in the parameters array, the
     * result array should include an `offset` key that defaults to 0.
     */
    public function testOffsetWhenNoValueIsPassed()
    {

        $exhibit = $this->__exhibit();
        $record = $this->__record($exhibit);

        // When no offset defined, should default to 0.
        $result = $this->_recordsTable->queryRecords($exhibit);
        $this->assertEquals($result['offset'], 0);

    }


    /**
     * When an `offset` key is included in the parameters array, it should
     * be echoed back in the`offset` key on the results array.
     */
    public function testOffsetWhenValueIsPassed()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // Limit to two records.
        $result = $this->_recordsTable->queryRecords($exhibit,
            array('limit' => 1, 'offset' => 1));
        $this->assertEquals($result['offset'], 1);

    }


}
