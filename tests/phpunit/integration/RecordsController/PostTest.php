<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Post extends Neatline_Case_Default
{


    /**
     * POST should create a new record and respond with the new id.
     */
    public function testCreateRecord()
    {

        $exhibit = $this->_exhibit();

        $this->_setPost(array(
            'exhibit_id'            => $exhibit->id,
            'slug'                  => '1',
            'title'                 => '2',
            'body'                  => '3',
            'coverage'              => 'POINT(4 4)',
            'tags'                  => '5',
            'widgets'               => array('6','7'),
            'presenter'             => '8',
            'fill_color'            => '9',
            'fill_color_select'     => '10',
            'stroke_color'          => '11',
            'stroke_color_select'   => '12',
            'fill_opacity'          => '0.13',
            'fill_opacity_select'   => '0.14',
            'stroke_opacity'        => '0.15',
            'stroke_opacity_select' => '0.16',
            'stroke_width'          => '17',
            'point_radius'          => '18',
            'zindex'                => '19',
            'weight'                => '20',
            'start_date'            => '21',
            'end_date'              => '22',
            'after_date'            => '23',
            'before_date'           => '24',
            'point_image'           => '25',
            'min_zoom'              => '26',
            'max_zoom'              => '27',
            'map_zoom'              => '28',
            'map_focus'             => '29'
        ));

        $c1 = $this->_records->count();
        $this->dispatch('neatline/records');
        $c2 = $this->_records->count();

        // Should create new record.
        $this->assertEquals($c2, $c1+1);

        // Should emit new id.
        $response = $this->_getResponseArray();
        $this->assertNotNull($response->id);

        // Load the new record.
        $r = $this->_records->find($response->id);

        // Should update fields.
        $this->assertEquals($exhibit->id,   $r->exhibit_id);
        $this->assertEquals('1',            $r->slug);
        $this->assertEquals('2',            $r->title);
        $this->assertEquals('3',            $r->body);
        $this->assertEquals('POINT(4 4)',   $r->coverage);
        $this->assertEquals('5',            $r->tags);
        $this->assertEquals('6,7',          $r->widgets);
        $this->assertEquals('8',            $r->presenter);
        $this->assertEquals('9',            $r->fill_color);
        $this->assertEquals('10',           $r->fill_color_select);
        $this->assertEquals('11',           $r->stroke_color);
        $this->assertEquals('12',           $r->stroke_color_select);
        $this->assertEquals(0.13,           $r->fill_opacity);
        $this->assertEquals(0.14,           $r->fill_opacity_select);
        $this->assertEquals(0.15,           $r->stroke_opacity);
        $this->assertEquals(0.16,           $r->stroke_opacity_select);
        $this->assertEquals(17,             $r->stroke_width);
        $this->assertEquals(18,             $r->point_radius);
        $this->assertEquals(19,             $r->zindex);
        $this->assertEquals(20,             $r->weight);
        $this->assertEquals('21',           $r->start_date);
        $this->assertEquals('22',           $r->end_date);
        $this->assertEquals('23',           $r->after_date);
        $this->assertEquals('24',           $r->before_date);
        $this->assertEquals('25',           $r->point_image);
        $this->assertEquals(26,             $r->min_zoom);
        $this->assertEquals(27,             $r->max_zoom);
        $this->assertEquals(28,             $r->map_zoom);
        $this->assertEquals('29',           $r->map_focus);

    }


    /**
     * POST should set the `item_id` field.
     */
    public function testSetItemId()
    {

        $item = $this->_item();
        $exhibit = $this->_exhibit();

        $this->_setPost(array(
            'exhibit_id'    => $exhibit->id,
            'item_id'       => $item->id
        ));

        $this->dispatch('neatline/records');
        $record = $this->_getLastRow($this->_records);

        // Should update `item_id`.
        $this->assertEquals($item->id, $record->item_id);

    }


    /**
     * POST should set the `wms_address` and `wms_layers` fields.
     */
    public function testSetWmsFields()
    {

        $exhibit = $this->_exhibit();

        $this->_setPost(array(
            'exhibit_id'    => $exhibit->id,
            'wms_address'   => '1',
            'wms_layers'    => '2',
        ));

        $this->dispatch('neatline/records');
        $record = $this->_getLastRow($this->_records);

        // Should update WMS address/layers.
        $this->assertEquals('1', $record->wms_address);
        $this->assertEquals('2', $record->wms_layers);

    }


    /**
     * POST should respond with all record attributes.
     */
    public function testResponse()
    {

        $exhibit = $this->_exhibit();

        $this->_setPost(array(
            'exhibit_id' => $exhibit->id
        ));

        $this->dispatch('neatline/records');
        $response = $this->_getResponseArray();

        // Get the new record.
        $record = $this->_getLastRow($this->_records);

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertObjectHasAttribute($k, $response);
        }

    }


}
