<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

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
        $json = $this->_getResponseArray();
        $this->assertNotNull($json['id']);

        // Load the new record.
        $record = $this->_records->find($json['id']);

        // Should update fields.
        $this->assertEquals($exhibit->id,   $record->exhibit_id);
        $this->assertEquals('1',            $record->slug);
        $this->assertEquals('2',            $record->title);
        $this->assertEquals('3',            $record->body);
        $this->assertEquals('POINT(4 4)',   $record->coverage);
        $this->assertEquals('5',            $record->tags);
        $this->assertEquals('6,7',          $record->widgets);
        $this->assertEquals('8',            $record->presenter);
        $this->assertEquals('9',            $record->fill_color);
        $this->assertEquals('10',           $record->fill_color_select);
        $this->assertEquals('11',           $record->stroke_color);
        $this->assertEquals('12',           $record->stroke_color_select);
        $this->assertEquals(0.13,           $record->fill_opacity);
        $this->assertEquals(0.14,           $record->fill_opacity_select);
        $this->assertEquals(0.15,           $record->stroke_opacity);
        $this->assertEquals(0.16,           $record->stroke_opacity_select);
        $this->assertEquals(17,             $record->stroke_width);
        $this->assertEquals(18,             $record->point_radius);
        $this->assertEquals(19,             $record->zindex);
        $this->assertEquals(20,             $record->weight);
        $this->assertEquals('21',           $record->start_date);
        $this->assertEquals('22',           $record->end_date);
        $this->assertEquals('23',           $record->after_date);
        $this->assertEquals('24',           $record->before_date);
        $this->assertEquals('25',           $record->point_image);
        $this->assertEquals(26,             $record->min_zoom);
        $this->assertEquals(27,             $record->max_zoom);
        $this->assertEquals(28,             $record->map_zoom);
        $this->assertEquals('29',           $record->map_focus);

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
        $json = $this->_getResponseArray();

        // Get the new record.
        $record = $this->_getLastRow($this->_records);

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertArrayHasKey($k, $json);
        }

    }


}
