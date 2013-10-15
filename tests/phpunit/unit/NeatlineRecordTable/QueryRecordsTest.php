<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecords extends Neatline_Case_Default
{


    /**
     * `queryRecords` should get records that belong to the passed exhibit.
     * Records in other exhibits should be excluded.
     */
    public function testExhibitFilter()
    {

        $exhibit1 = $this->_exhibit();
        $exhibit2 = $this->_exhibit();
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
        $result = $this->_records->queryRecords($exhibit1);

        // Exhibit2 records should be absent.
        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


    /**
     * `queryRecords` should filter on zoom.
     */
    public function testZoomFilter()
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
        $result = $this->_records->queryRecords($exhibit);

        $this->assertEquals($record4->id, $result['records'][0]['id']);
        $this->assertEquals($record3->id, $result['records'][1]['id']);
        $this->assertEquals($record2->id, $result['records'][2]['id']);
        $this->assertEquals($record1->id, $result['records'][3]['id']);
        $this->assertCount(4, $result['records']);

        // Zoom < min_zoom.
        $result = $this->_records->queryRecords($exhibit,
            array('zoom' => 9)
        );

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // Zoom > min_zoom.
        $result = $this->_records->queryRecords($exhibit,
            array('zoom' => 16)
        );

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // min_zoom < Zoom < max_zoom.
        $result = $this->_records->queryRecords($exhibit,
            array('zoom' => 25)
        );

        $this->assertEquals($record4->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record1->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

    }


    /**
     * `queryRecords` should filter on extent.
     */
    public function testExtentFilter()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POINT(1 1)';
        $record2->coverage = 'POINT(3 3)';
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';

        $record1->save();
        $record2->save();

        // Extent=null, get all records.
        $result = $this->_records->queryRecords($exhibit);

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // Record 1 intersection.
        $result = $this->_records->queryRecords($exhibit,
            array('extent' => 'POLYGON((0 0,0 2,2 2,2 0,0 0))')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Record 2 intersection.
        $result = $this->_records->queryRecords($exhibit,
            array('extent' => 'POLYGON((2 2,2 4,4 4,4 2,2 2))')
        );

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Record 1 and record 2 intersection.
        $result = $this->_records->queryRecords($exhibit,
            array('extent' => 'POLYGON((0 0,0 4,4 4,4 0,0 0))')
        );

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


    /**
     * When an `extent` polygon is passed to `queryRecords`, records that have
     * been saved with empty coverages (represented with the de-facto NULL
     * `POINT(0 0)` WKT string) should not be returned in the result set, even
     * when the `extent` includes the 0,0 point.
     */
    public function testExtentFilterNoCoverageOmission()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->coverage = 'POINT(1 1)';

        $record1->save();
        $record2->save();

        // Record with `POINT(0 0`)` excluded.
        $result = $this->_records->queryRecords($exhibit,
            array('extent' => 'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * When a WMS layer is defined on a record, the record should always be
     * matched by extent queries.
     */
    public function testExtentFilterWmsLayerInclusion()
    {

        $exhibit = $this->_exhibit();
        $record = $this->_record($exhibit);
        $record->wms_address = 'address';
        $record->wms_layers = 'layers';

        $record->save();

        // WMS layer should be included.
        $result = $this->_records->queryRecords($exhibit,
            array('extent' => 'POLYGON((-1 -1,-1 1,1 1,1 -1,-1 -1))')
        );

        $this->assertEquals($record->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * `queryRecords` should search for keywords in the `title`, `body`, and
     * `slug` fields.
     */
    public function testKeywordsFilter()
    {

        $exhibit = $this->_exhibit();

        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->body  = 'body1';
        $record2->body  = 'body2';
        $record3->body  = 'body3';
        $record1->slug  = 'slug1';
        $record2->slug  = 'slug2';
        $record3->slug  = 'slug3';

        $record1->save();
        $record2->save();
        $record3->save();

        // Should search in `title` field.
        $result = $this->_records->queryRecords($exhibit,
            array('query' => 'title1')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Should search in `body` field.
        $result = $this->_records->queryRecords($exhibit,
            array('query' => 'body1')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Should search in `slug` field.
        $result = $this->_records->queryRecords($exhibit,
            array('query' => 'slug1')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * `queryRecords` should filter on a tags query.
     */
    public function testTagsFilter()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag1,tag2';
        $record3->tags = 'tag3';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for tag1 and tag2.
        $result = $this->_records->queryRecords($exhibit,
            array('tags' => array('tag1', 'tag2'))
        );

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * `queryRecords` should filter on a widget query.
     */
    public function testWidgetFilter()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->widgets = 'Widget1';
        $record2->widgets = 'Widget1,Widget2';
        $record3->widgets = 'Widget3';
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for `tag1` and `tag2`.
        $result = $this->_records->queryRecords($exhibit,
            array('widget' => 'Widget1')
        );

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertEquals($record1->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


    /**
     * `queryRecords` should sort records on the order column.
     */
    public function testOrderFilter()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->weight = 1;
        $record2->weight = 2;
        $record3->weight = 3;
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        // Order on `weight`, by default ascending.
        $result = $this->_records->queryRecords($exhibit,
            array('order' => 'weight')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record3->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

        // Order on `weight ASC`.
        $result = $this->_records->queryRecords($exhibit,
            array('order' => 'weight ASC')
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record3->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

        // Order on `weight DESC`.
        $result = $this->_records->queryRecords($exhibit,
            array('order' => 'weight DESC')
        );

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertEquals($record1->id, $result['records'][2]['id']);
        $this->assertCount(3, $result['records']);

    }


    /**
     * When a `limit` and `offset` values are passed to `queryRecords`, the
     * result set should be truncated to the `limit` length, starting from the
     * `offset` value.
     */
    public function testLimitFilter()
    {

        $exhibit = $this->_exhibit();
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
        $result = $this->_records->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 0)
        );

        $this->assertEquals($record5->id, $result['records'][0]['id']);
        $this->assertEquals($record4->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // Records 3-4.
        $result = $this->_records->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 2)
        );

        $this->assertEquals($record3->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

        // Record 5.
        $result = $this->_records->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 4)
        );

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * When a `limit` and `offset` values are passed to `queryRecords`, the
     * result set should include a `count` key with the original size of the
     * result set before the limit was applied.
     */
    public function testTotalRecordCount()
    {

        $exhibit = $this->_exhibit();
        $record1 = $this->_record($exhibit);
        $record2 = $this->_record($exhibit);
        $record3 = $this->_record($exhibit);

        // Limit to 2 records.
        $result = $this->_records->queryRecords($exhibit,
            array('limit' => 2, 'offset' => 0)
        );

        $this->assertEquals(3, $result['count']);

    }


    /**
     * When an `offset` is not included in the parameters array, the result
     * array should include an `offset` key that defaults to 0.
     */
    public function testOffsetWhenNoValueIsPassed()
    {

        $exhibit = $this->_exhibit();
        $record = $this->_record($exhibit);

        // When no offset defined, should default to 0.
        $result = $this->_records->queryRecords($exhibit);
        $this->assertEquals(0, $result['offset']);

    }


    /**
     * When an `offset` key is included in the parameters array, it should be
     * echoed back in the`offset` key on the results array.
     */
    public function testOffsetWhenValueIsPassed()
    {

        $exhibit = $this->_exhibit();
        $record1 = $this->_record($exhibit);
        $record2 = $this->_record($exhibit);

        // Limit to two records.
        $result = $this->_records->queryRecords($exhibit,
            array('limit' => 1, 'offset' => 1)
        );

        $this->assertEquals(1, $result['offset']);

    }


}
