<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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
        $this->assertEquals($response->count, 2);

        // Record 2:
        $this->assertEquals($r[0]->id,                      $record2->id);
        $this->assertEquals($r[0]->item_id,                 $item2->id);
        $this->assertEquals($r[0]->slug,                    '2');
        $this->assertEquals($r[0]->title,                   '4');
        $this->assertEquals($r[0]->body,                    '6');
        $this->assertEquals($r[0]->coverage,                'POINT(8 8)');
        $this->assertEquals($r[0]->tags,                    '10');
        $this->assertEquals($r[0]->widgets,                 '12');
        $this->assertEquals($r[0]->presenter,               '14');
        $this->assertEquals($r[0]->fill_color,              '16');
        $this->assertEquals($r[0]->fill_color_select,       '18');
        $this->assertEquals($r[0]->stroke_color,            '20');
        $this->assertEquals($r[0]->stroke_color_select,     '22');
        $this->assertEquals($r[0]->fill_opacity,            0.24);
        $this->assertEquals($r[0]->fill_opacity_select,     0.26);
        $this->assertEquals($r[0]->stroke_opacity,          0.28);
        $this->assertEquals($r[0]->stroke_opacity_select,   0.30);
        $this->assertEquals($r[0]->stroke_width,            32);
        $this->assertEquals($r[0]->point_radius,            34);
        $this->assertEquals($r[0]->zindex,                  36);
        $this->assertEquals($r[0]->weight,                  38);
        $this->assertEquals($r[0]->start_date,              '40');
        $this->assertEquals($r[0]->end_date,                '42');
        $this->assertEquals($r[0]->after_date,              '44');
        $this->assertEquals($r[0]->before_date,             '46');
        $this->assertEquals($r[0]->point_image,             '48');
        $this->assertEquals($r[0]->wms_address,             '50');
        $this->assertEquals($r[0]->wms_layers,              '52');
        $this->assertEquals($r[0]->min_zoom,                54);
        $this->assertEquals($r[0]->max_zoom,                56);
        $this->assertEquals($r[0]->map_zoom,                58);
        $this->assertEquals($r[0]->map_focus,               '60');

        // Record 1:
        $this->assertEquals($r[1]->id,                      $record1->id);
        $this->assertEquals($r[1]->item_id,                 $item1->id);
        $this->assertEquals($r[1]->slug,                    '1');
        $this->assertEquals($r[1]->title,                   '3');
        $this->assertEquals($r[1]->body,                    '5');
        $this->assertEquals($r[1]->coverage,                'POINT(7 7)');
        $this->assertEquals($r[1]->tags,                    '9');
        $this->assertEquals($r[1]->widgets,                 '11');
        $this->assertEquals($r[1]->presenter,               '13');
        $this->assertEquals($r[1]->fill_color,              '15');
        $this->assertEquals($r[1]->fill_color_select,       '17');
        $this->assertEquals($r[1]->stroke_color,            '19');
        $this->assertEquals($r[1]->stroke_color_select,     '21');
        $this->assertEquals($r[1]->fill_opacity,            0.23);
        $this->assertEquals($r[1]->fill_opacity_select,     0.25);
        $this->assertEquals($r[1]->stroke_opacity,          0.27);
        $this->assertEquals($r[1]->stroke_opacity_select,   0.29);
        $this->assertEquals($r[1]->stroke_width,            31);
        $this->assertEquals($r[1]->point_radius,            33);
        $this->assertEquals($r[1]->zindex,                  35);
        $this->assertEquals($r[1]->weight,                  37);
        $this->assertEquals($r[1]->start_date,              '39');
        $this->assertEquals($r[1]->end_date,                '41');
        $this->assertEquals($r[1]->after_date,              '43');
        $this->assertEquals($r[1]->before_date,             '45');
        $this->assertEquals($r[1]->point_image,             '47');
        $this->assertEquals($r[1]->wms_address,             '49');
        $this->assertEquals($r[1]->wms_layers,              '51');
        $this->assertEquals($r[1]->min_zoom,                53);
        $this->assertEquals($r[1]->max_zoom,                55);
        $this->assertEquals($r[1]->map_zoom,                57);
        $this->assertEquals($r[1]->map_focus,               '59');

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
        $response = $this->_getResponseArray();

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
        $response = $this->_getResponseArray();

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
        $response = $this->_getResponseArray();

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
            'tags' => array('tag1', 'tag2')
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

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
            'widget' => 'Widget1'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply widget filter.
        $this->assertEquals($response->records[0]->id, $record1->id);
        $this->assertCount(1, $response->records);

    }


    /**
     * The `slug` parameter should be passed to the query.
     */
    public function testSlugFilter()
    {

        $record1 = new NeatlineRecord($this->exhibit);
        $record2 = new NeatlineRecord($this->exhibit);
        $record1->slug = 'slug-1';
        $record2->slug = 'slug-2';

        $record1->save();
        $record2->save();

        $this->request->setQuery(array(
            'slug' => 'slug-1'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply slug filter.
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
            'order' => 'weight'
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

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
            'limit'   => 1,
            'offset'  => 1
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Should apply limit filter.
        $this->assertEquals($response->records[0]->id, $record2->id);
        $this->assertCount(1, $response->records);

    }


}
