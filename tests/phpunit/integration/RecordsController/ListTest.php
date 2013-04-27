<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_List extends Neatline_TestCase
{


    /**
     * Create exhibit, set parameter on request.
     */
    public function setUp()
    {

        parent::setUp();

        // Create exhibit.
        $this->exhibit = $this->__exhibit();

        // Set GET parameter.
        $this->request->setQuery(array(
          'exhibit_id' => $this->exhibit->id
        ));

    }


    /**
     * LIST should emit a JSON representation of a collection of records.
     */
    public function testList()
    {

        $item1      = $this->__item();
        $item2      = $this->__item();
        $record1    = new NeatlineRecord($this->exhibit, $item1);
        $record2    = new NeatlineRecord($this->exhibit, $item2);

        $record1->added             = '2001-01-01';
        $record2->added             = '2002-01-01';
        $record1->title             = '1';
        $record2->title             = '2';
        $record1->body              = '3';
        $record2->body              = '4';
        $record1->coverage          = 'POINT(5 5)';
        $record2->coverage          = 'POINT(6 6)';
        $record1->tags              = '7';
        $record2->tags              = '8';
        $record1->widgets           = '9';
        $record2->widgets           = '10';
        $record1->presenter         = '11';
        $record2->presenter         = '12';
        $record1->fill_color        = '13';
        $record2->fill_color        = '14';
        $record1->select_color      = '15';
        $record2->select_color      = '16';
        $record1->stroke_color      = '17';
        $record2->stroke_color      = '18';
        $record1->fill_opacity      = 19;
        $record2->fill_opacity      = 20;
        $record1->select_opacity    = 21;
        $record2->select_opacity    = 22;
        $record1->stroke_opacity    = 23;
        $record2->stroke_opacity    = 24;
        $record1->stroke_width      = 25;
        $record2->stroke_width      = 26;
        $record1->point_radius      = 27;
        $record2->point_radius      = 28;
        $record1->point_image       = '29';
        $record2->point_image       = '30';
        $record1->min_zoom          = 31;
        $record2->min_zoom          = 32;
        $record1->max_zoom          = 33;
        $record2->max_zoom          = 34;
        $record1->map_zoom          = 35;
        $record2->map_zoom          = 36;
        $record1->map_focus         = '37';
        $record2->map_focus         = '38';
        $record1->wms_address       = '39';
        $record2->wms_address       = '40';
        $record1->wms_layers        = '41';
        $record2->wms_layers        = '42';
        $record1->start_date        = '43';
        $record2->start_date        = '44';
        $record1->end_date          = '45';
        $record2->end_date          = '46';
        $record1->after_date        = '47';
        $record2->after_date        = '48';
        $record1->before_date       = '49';
        $record2->before_date       = '50';
        $record1->weight            = 51;
        $record2->weight            = 52;

        $record1->__save();
        $record2->__save();

        $this->dispatch('neatline/records');

        // Get response, alias records.
        $response = $this->getResponseArray();
        $records = $response->records;

        // `count` should equal result size.
        $this->assertEquals($response->count, 2);

        // Record 2:
        $this->assertEquals($records[0]->id,                $record2->id);
        $this->assertEquals($records[0]->item_id,           $item2->id);
        $this->assertEquals($records[0]->title,             '2');
        $this->assertEquals($records[0]->body,              '4');
        $this->assertEquals($records[0]->coverage,          'POINT(6 6)');
        $this->assertEquals($records[0]->tags,              '8');
        $this->assertEquals($records[0]->widgets,           '10');
        $this->assertEquals($records[0]->presenter,         '12');
        $this->assertEquals($records[0]->fill_color,        '14');
        $this->assertEquals($records[0]->select_color,      '16');
        $this->assertEquals($records[0]->stroke_color,      '18');
        $this->assertEquals($records[0]->fill_opacity,      20);
        $this->assertEquals($records[0]->select_opacity,    22);
        $this->assertEquals($records[0]->stroke_opacity,    24);
        $this->assertEquals($records[0]->stroke_width,      26);
        $this->assertEquals($records[0]->point_radius,      28);
        $this->assertEquals($records[0]->point_image,       '30');
        $this->assertEquals($records[0]->min_zoom,          32);
        $this->assertEquals($records[0]->max_zoom,          34);
        $this->assertEquals($records[0]->map_zoom,          36);
        $this->assertEquals($records[0]->map_focus,         '38');
        $this->assertEquals($records[0]->wms_address,       '40');
        $this->assertEquals($records[0]->wms_layers,        '42');
        $this->assertEquals($records[0]->start_date,        '44');
        $this->assertEquals($records[0]->end_date,          '46');
        $this->assertEquals($records[0]->after_date,        '48');
        $this->assertEquals($records[0]->before_date,       '50');
        $this->assertEquals($records[0]->weight,            52);

        // Record 1:
        $this->assertEquals($records[1]->id,                $record1->id);
        $this->assertEquals($records[1]->item_id,           $item1->id);
        $this->assertEquals($records[1]->title,             '1');
        $this->assertEquals($records[1]->body,              '3');
        $this->assertEquals($records[1]->coverage,          'POINT(5 5)');
        $this->assertEquals($records[1]->tags,              '7');
        $this->assertEquals($records[1]->widgets,           '9');
        $this->assertEquals($records[1]->presenter,         '11');
        $this->assertEquals($records[1]->fill_color,        '13');
        $this->assertEquals($records[1]->select_color,      '15');
        $this->assertEquals($records[1]->stroke_color,      '17');
        $this->assertEquals($records[1]->fill_opacity,      19);
        $this->assertEquals($records[1]->select_opacity,    21);
        $this->assertEquals($records[1]->stroke_opacity,    23);
        $this->assertEquals($records[1]->stroke_width,      25);
        $this->assertEquals($records[1]->point_radius,      27);
        $this->assertEquals($records[1]->point_image,       '29');
        $this->assertEquals($records[1]->min_zoom,          31);
        $this->assertEquals($records[1]->max_zoom,          33);
        $this->assertEquals($records[1]->map_zoom,          35);
        $this->assertEquals($records[1]->map_focus,         '37');
        $this->assertEquals($records[1]->wms_address,       '39');
        $this->assertEquals($records[1]->wms_layers,        '41');
        $this->assertEquals($records[1]->start_date,        '43');
        $this->assertEquals($records[1]->end_date,          '45');
        $this->assertEquals($records[1]->after_date,        '47');
        $this->assertEquals($records[1]->before_date,       '49');
        $this->assertEquals($records[1]->weight,            51);

    }


    /**
     * LIST should only return records for the requested exhibit.
     */
    public function testExhibitFilter()
    {

        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($exhibit2);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();
        $records = $response->records;

        // Should apply exhibit filter.
        $this->assertEquals($records[0]->id, $record2->id);
        $this->assertEquals($records[1]->id, $record1->id);
        $this->assertCount(2, $response->records);

    }


    /**
     * The `zoom` parameter should be passed to the query.
     */
    public function testZoomFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->min_zoom = 1;
        $record2->min_zoom = 2;

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'zoom' => 1
        ));

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `extent` parameter should be passed to the query.
     */
    public function testExtentFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->coverage = 'POINT(1 1)';
        $record2->coverage = 'POINT(3 3)';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
          'extent' => 'POLYGON((0 0,0 2,2 2,2 0,0 0))'
        ));

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `query` parameter should be passed to the query.
     */
    public function testKeywordsFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->title = 'neatline';
        $record2->title = 'omeka';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'query' => 'neatline'
        ));

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply query filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `tags` parameter should be passed to the query.
     */
    public function testTagsFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->tags = 'tag1, tag2';
        $record2->tags = 'tag3';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'tags' => array('tag1', 'tag2'))
        );

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply tags filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `widget` parameter should be passed to the query.
     */
    public function testWidgetFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->widgets = 'Widget1';
        $record2->widgets = 'Widget2';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'widget' => 'Widget1')
        );

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply widget filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `order` parameter should be passed to the query.
     */
    public function testOrderFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($this->exhibit);
        $record1->weight = 1;
        $record2->weight = 2;
        $record3->weight = 3;
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->request->setQuery(array(
            'order' => 'weight')
        );

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should order on `weight`.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertEquals($response->records[1]->id, $record2->id);
        $this->assertEquals($response->records[2]->id, $record3->id);
        $this->assertCount(3, $response->records);

    }


    /**
     * The `limit` and `offset` parameters should be passed to the query.
     */
    public function testLimitFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($this->exhibit);
        $record1->added = '2001-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2003-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->request->setQuery(array(
            'limit' => 1,
            'offset' => 1
        ));

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Should apply limit filter.
        $this->assertEquals($response->records[0]->id, $record2->id);
        $this->assertCount(1, $response->records);

    }


}
