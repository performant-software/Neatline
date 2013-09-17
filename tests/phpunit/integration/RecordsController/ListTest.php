<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_List extends Neatline_Case_Default
{


    /**
     * Create exhibit, set parameter on request.
     */
    public function setUp()
    {

        parent::setUp();

        // Create exhibit.
        $this->exhibit = $this->_exhibit();

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

        $item1      = $this->_item();
        $item2      = $this->_item();
        $record1    = new NeatlineRecord($this->exhibit, $item1);
        $record2    = new NeatlineRecord($this->exhibit, $item2);

        $record1->added                 = '2001-01-01';
        $record2->added                 = '2002-01-01';
        $record1->slug                  = '1';
        $record2->slug                  = '2';
        $record1->title                 = '3';
        $record2->title                 = '4';
        $record1->body                  = '5';
        $record2->body                  = '6';
        $record1->coverage              = 'POINT(7 7)';
        $record2->coverage              = 'POINT(8 8)';
        $record1->tags                  = '9';
        $record2->tags                  = '10';
        $record1->widgets               = '11';
        $record2->widgets               = '12';
        $record1->presenter             = '13';
        $record2->presenter             = '14';
        $record1->fill_color            = '15';
        $record2->fill_color            = '16';
        $record1->fill_color_select     = '17';
        $record2->fill_color_select     = '18';
        $record1->stroke_color          = '19';
        $record2->stroke_color          = '20';
        $record1->stroke_color_select   = '21';
        $record2->stroke_color_select   = '22';
        $record1->fill_opacity          = 0.23;
        $record2->fill_opacity          = 0.24;
        $record1->fill_opacity_select   = 0.25;
        $record2->fill_opacity_select   = 0.26;
        $record1->stroke_opacity        = 0.27;
        $record2->stroke_opacity        = 0.28;
        $record1->stroke_opacity_select = 0.29;
        $record2->stroke_opacity_select = 0.30;
        $record1->stroke_width          = 31;
        $record2->stroke_width          = 32;
        $record1->point_radius          = 33;
        $record2->point_radius          = 34;
        $record1->zindex                = 35;
        $record2->zindex                = 36;
        $record1->weight                = 37;
        $record2->weight                = 38;
        $record1->start_date            = '39';
        $record2->start_date            = '40';
        $record1->end_date              = '41';
        $record2->end_date              = '42';
        $record1->after_date            = '43';
        $record2->after_date            = '44';
        $record1->before_date           = '45';
        $record2->before_date           = '46';
        $record1->point_image           = '47';
        $record2->point_image           = '48';
        $record1->wms_address           = '49';
        $record2->wms_address           = '50';
        $record1->wms_layers            = '51';
        $record2->wms_layers            = '52';
        $record1->min_zoom              = 53;
        $record2->min_zoom              = 54;
        $record1->max_zoom              = 55;
        $record2->max_zoom              = 56;
        $record1->map_zoom              = 57;
        $record2->map_zoom              = 58;
        $record1->map_focus             = '59';
        $record2->map_focus             = '60';

        $record1->__save();
        $record2->__save();

        $this->dispatch('neatline/records');

        // Get response, alias records.
        $response = $this->_getResponseArray();
        $r = $response->records;

        // `count` should equal result size.
        $this->assertEquals(2, $response->count);

        // Record 2:
        $this->assertEquals($record2->id,   $r[0]->id);
        $this->assertEquals($item2->id,     $r[0]->item_id);
        $this->assertEquals('2',            $r[0]->slug);
        $this->assertEquals('4',            $r[0]->title);
        $this->assertEquals('6',            $r[0]->body);
        $this->assertEquals('POINT(8 8)',   $r[0]->coverage);
        $this->assertEquals('10',           $r[0]->tags);
        $this->assertEquals('12',           $r[0]->widgets);
        $this->assertEquals('14',           $r[0]->presenter);
        $this->assertEquals('16',           $r[0]->fill_color);
        $this->assertEquals('18',           $r[0]->fill_color_select);
        $this->assertEquals('20',           $r[0]->stroke_color);
        $this->assertEquals('22',           $r[0]->stroke_color_select);
        $this->assertEquals(0.24,           $r[0]->fill_opacity);
        $this->assertEquals(0.26,           $r[0]->fill_opacity_select);
        $this->assertEquals(0.28,           $r[0]->stroke_opacity);
        $this->assertEquals(0.30,           $r[0]->stroke_opacity_select);
        $this->assertEquals(32,             $r[0]->stroke_width);
        $this->assertEquals(34,             $r[0]->point_radius);
        $this->assertEquals(36,             $r[0]->zindex);
        $this->assertEquals(38,             $r[0]->weight);
        $this->assertEquals('40',           $r[0]->start_date);
        $this->assertEquals('42',           $r[0]->end_date);
        $this->assertEquals('44',           $r[0]->after_date);
        $this->assertEquals('46',           $r[0]->before_date);
        $this->assertEquals('48',           $r[0]->point_image);
        $this->assertEquals('50',           $r[0]->wms_address);
        $this->assertEquals('52',           $r[0]->wms_layers);
        $this->assertEquals(54,             $r[0]->min_zoom);
        $this->assertEquals(56,             $r[0]->max_zoom);
        $this->assertEquals(58,             $r[0]->map_zoom);
        $this->assertEquals('60',           $r[0]->map_focus);

        // Record 1:
        $this->assertEquals($record1->id,   $r[1]->id);
        $this->assertEquals($item1->id,     $r[1]->item_id);
        $this->assertEquals('1',            $r[1]->slug);
        $this->assertEquals('3',            $r[1]->title);
        $this->assertEquals('5',            $r[1]->body);
        $this->assertEquals('POINT(7 7)',   $r[1]->coverage);
        $this->assertEquals('9',            $r[1]->tags);
        $this->assertEquals('11',           $r[1]->widgets);
        $this->assertEquals('13',           $r[1]->presenter);
        $this->assertEquals('15',           $r[1]->fill_color);
        $this->assertEquals('17',           $r[1]->fill_color_select);
        $this->assertEquals('19',           $r[1]->stroke_color);
        $this->assertEquals('21',           $r[1]->stroke_color_select);
        $this->assertEquals(0.23,           $r[1]->fill_opacity);
        $this->assertEquals(0.25,           $r[1]->fill_opacity_select);
        $this->assertEquals(0.27,           $r[1]->stroke_opacity);
        $this->assertEquals(0.29,           $r[1]->stroke_opacity_select);
        $this->assertEquals(31,             $r[1]->stroke_width);
        $this->assertEquals(33,             $r[1]->point_radius);
        $this->assertEquals(35,             $r[1]->zindex);
        $this->assertEquals(37,             $r[1]->weight);
        $this->assertEquals('39',           $r[1]->start_date);
        $this->assertEquals('41',           $r[1]->end_date);
        $this->assertEquals('43',           $r[1]->after_date);
        $this->assertEquals('45',           $r[1]->before_date);
        $this->assertEquals('47',           $r[1]->point_image);
        $this->assertEquals('49',           $r[1]->wms_address);
        $this->assertEquals('51',           $r[1]->wms_layers);
        $this->assertEquals(53,             $r[1]->min_zoom);
        $this->assertEquals(55,             $r[1]->max_zoom);
        $this->assertEquals(57,             $r[1]->map_zoom);
        $this->assertEquals('59',           $r[1]->map_focus);

    }


    /**
     * LIST should only return records for the requested exhibit.
     */
    public function testExhibitFilter()
    {

        $exhibit2 = $this->_exhibit();
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
        $response = $this->_getResponseArray();
        $records = $response->records;

        // Should apply exhibit filter.
        $this->assertEquals($record2->id, $records[0]->id);
        $this->assertEquals($record1->id, $records[1]->id);
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
        $response = $this->_getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($record1->id, $response->records[0]->id);
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
        $response = $this->_getResponseArray();

        // Should apply zoom filter.
        $this->assertEquals($record1->id, $response->records[0]->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `query` parameter should be passed to the query.
     */
    public function testKeywordsFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record3 = new NeatlineRecord($this->exhibit);
        $record1->title = 'neatline';
        $record2->title = 'omeka';
        $record3->title = 'geoserver';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->request->setQuery(array(
            'query' => 'neatline'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply query filter.
        $this->assertEquals($record1->id, $response->records[0]->id);
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
            'tags' => array('tag1', 'tag2')
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply tags filter.
        $this->assertEquals($record1->id, $response->records[0]->id);
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
            'widget' => 'Widget1'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply widget filter.
        $this->assertEquals($record1->id, $response->records[0]->id);
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
            'order' => 'weight'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should order on `weight`.
        $this->assertEquals($record1->id, $response->records[0]->id);
        $this->assertEquals($record2->id, $response->records[1]->id);
        $this->assertEquals($record3->id, $response->records[2]->id);
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
            'limit'   => 1,
            'offset'  => 1
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply limit filter.
        $this->assertEquals($record2->id, $response->records[0]->id);
        $this->assertCount(1, $response->records);

    }


}
