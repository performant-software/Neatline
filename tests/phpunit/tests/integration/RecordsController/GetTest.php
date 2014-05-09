<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Get extends Neatline_Case_Default
{


    /**
     * GET should emit a JSON representation of a single record.
     */
    public function testGet()
    {

        $item   = $this->_item();
        $record = $this->_record(null, $item);

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
            'fill_opacity'          => 0.12,
            'fill_opacity_select'   => 0.13,
            'stroke_opacity'        => 0.14,
            'stroke_opacity_select' => 0.15,
            'stroke_width'          => 16,
            'point_radius'          => 17,
            'zindex'                => 18,
            'weight'                => 19,
            'start_date'            => '20',
            'end_date'              => '21',
            'after_date'            => '22',
            'before_date'           => '23',
            'point_image'           => '24',
            'wms_address'           => '25',
            'wms_layers'            => '26',
            'min_zoom'              => 27,
            'max_zoom'              => 28,
            'map_zoom'              => 29,
            'map_focus'             => '30'
        ));

        $record->__save();

        $this->dispatch('neatline/records/'.$record->id);
        $json = $this->_getResponseArray();

        $this->assertEquals($record->id,    $json['id']);
        $this->assertEquals($item->id,      $json['item_id']);
        $this->assertEquals('1',            $json['slug']);
        $this->assertEquals('2',            $json['title']);
        $this->assertEquals('3',            $json['body']);
        $this->assertEquals('POINT(4 4)',   $json['coverage']);
        $this->assertEquals('5',            $json['tags']);
        $this->assertEquals('6',            $json['widgets']);
        $this->assertEquals('7',            $json['presenter']);
        $this->assertEquals('8',            $json['fill_color']);
        $this->assertEquals('9',            $json['fill_color_select']);
        $this->assertEquals('10',           $json['stroke_color']);
        $this->assertEquals('11',           $json['stroke_color_select']);
        $this->assertEquals(0.12,           $json['fill_opacity']);
        $this->assertEquals(0.13,           $json['fill_opacity_select']);
        $this->assertEquals(0.14,           $json['stroke_opacity']);
        $this->assertEquals(0.15,           $json['stroke_opacity_select']);
        $this->assertEquals(16,             $json['stroke_width']);
        $this->assertEquals(17,             $json['point_radius']);
        $this->assertEquals(18,             $json['zindex']);
        $this->assertEquals(19,             $json['weight']);
        $this->assertEquals('20',           $json['start_date']);
        $this->assertEquals('21',           $json['end_date']);
        $this->assertEquals('22',           $json['after_date']);
        $this->assertEquals('23',           $json['before_date']);
        $this->assertEquals('24',           $json['point_image']);
        $this->assertEquals('25',           $json['wms_address']);
        $this->assertEquals('26',           $json['wms_layers']);
        $this->assertEquals(27,             $json['min_zoom']);
        $this->assertEquals(28,             $json['max_zoom']);
        $this->assertEquals(29,             $json['map_zoom']);
        $this->assertEquals('30',           $json['map_focus']);

    }


}
