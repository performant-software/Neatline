<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Put extends Neatline_Case_Default
{


    /**
     * PUT should update a record.
     */
    public function testUpdateRecord()
    {

        $record = $this->_record();

        $record->setArray(array(
            'slug'                  => '1',
            'title'                 => '2',
            'body'                  => '3',
            'coverage'              => 'POINT(4 4)',
            'tags'                  => '5',
            'widgets'               => '6',
            'presenter'             => '7',
            'fill_color'            => '8',
            'fill_color_select'     => '9',
            'stroke_color'          => '10',
            'stroke_color_select'   => '11',
            'fill_opacity'          => '0.12',
            'fill_opacity_select'   => '0.13',
            'stroke_opacity'        => '0.14',
            'stroke_opacity_select' => '0.15',
            'stroke_width'          => '16',
            'point_radius'          => '17',
            'zindex'                => '18',
            'weight'                => '19',
            'start_date'            => '20',
            'end_date'              => '21',
            'after_date'            => '22',
            'before_date'           => '23',
            'point_image'           => '24',
            'min_zoom'              => '25',
            'max_zoom'              => '26',
            'map_zoom'              => '27',
            'map_focus'             => '28'
        ));

        $record->save();

        $this->_setPut(array(
            'slug'                  => '2',
            'title'                 => '3',
            'body'                  => '4',
            'coverage'              => 'POINT(5 5)',
            'tags'                  => '6',
            'widgets'               => array('7','8'),
            'presenter'             => '9',
            'fill_color'            => '10',
            'fill_color_select'     => '11',
            'stroke_color'          => '12',
            'stroke_color_select'   => '13',
            'fill_opacity'          => '0.14',
            'fill_opacity_select'   => '0.15',
            'stroke_opacity'        => '0.16',
            'stroke_opacity_select' => '0.17',
            'stroke_width'          => '18',
            'point_radius'          => '19',
            'zindex'                => '20',
            'weight'                => '21',
            'start_date'            => '22',
            'end_date'              => '23',
            'after_date'            => '24',
            'before_date'           => '25',
            'point_image'           => '26',
            'min_zoom'              => '27',
            'max_zoom'              => '28',
            'map_zoom'              => '29',
            'map_focus'             => '30'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->_reload($record);

        $this->assertEquals('2',            $record->slug);
        $this->assertEquals('3',            $record->title);
        $this->assertEquals('4',            $record->body);
        $this->assertEquals('POINT(5 5)',   $record->coverage);
        $this->assertEquals('6',            $record->tags);
        $this->assertEquals('7,8',          $record->widgets);
        $this->assertEquals('9',            $record->presenter);
        $this->assertEquals('10',           $record->fill_color);
        $this->assertEquals('11',           $record->fill_color_select);
        $this->assertEquals('12',           $record->stroke_color);
        $this->assertEquals('13',           $record->stroke_color_select);
        $this->assertEquals(0.14,           $record->fill_opacity);
        $this->assertEquals(0.15,           $record->fill_opacity_select);
        $this->assertEquals(0.16,           $record->stroke_opacity);
        $this->assertEquals(0.17,           $record->stroke_opacity_select);
        $this->assertEquals(18,             $record->stroke_width);
        $this->assertEquals(19,             $record->point_radius);
        $this->assertEquals(20,             $record->zindex);
        $this->assertEquals(21,             $record->weight);
        $this->assertEquals('22',           $record->start_date);
        $this->assertEquals('23',           $record->end_date);
        $this->assertEquals('24',           $record->after_date);
        $this->assertEquals('25',           $record->before_date);
        $this->assertEquals('26',           $record->point_image);
        $this->assertEquals(27,             $record->min_zoom);
        $this->assertEquals(28,             $record->max_zoom);
        $this->assertEquals(29,             $record->map_zoom);
        $this->assertEquals('30',           $record->map_focus);

    }


    /**
     * PUT should update the `item_id` field.
     */
    public function testUpdateItemId()
    {

        $item = $this->_item();
        $record = $this->_record();

        $this->_setPut(array('item_id' => $item->id));
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->_reload($record);

        // Should update `item_id`.
        $this->assertEquals($item->id, $record->item_id);

    }


    /**
     * PUT should update the `wms_address` and `wms_layers` fields.
     */
    public function testUpdateWmsFields()
    {

        $record = $this->_record();

        $record->setArray(array(
            'wms_address'   => '1',
            'wms_layers'    => '2'
        ));

        $record->save();

        $this->_setPut(array(
            'wms_address'   => '3',
            'wms_layers'    => '4'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->_reload($record);

        // Should update WMS address/layers.
        $this->assertEquals('3', $record->wms_address);
        $this->assertEquals('4', $record->wms_layers);

    }


    /**
     * PUT should respond with all record attributes.
     */
    public function testResponse()
    {

        $record = $this->_record();

        $this->_setPut();
        $this->dispatch('neatline/records/'.$record->id);
        $json = $this->_getResponseArray();

        // Should emit correct record.
        $this->assertEquals($record->id, $json['id']);

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertArrayHasKey($k, $json);
        }

    }


}
