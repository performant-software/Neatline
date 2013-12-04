<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Get extends Neatline_Case_Default
{


    /**
     * GET should emit a JSON representation of a single record.
     */
    public function testGet()
    {

        $exhibit    = $this->_exhibit();
        $item       = $this->_item();
        $record     = new NeatlineRecord($exhibit, $item);

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
        $response = $this->_getResponseArray();

        $this->assertEquals($record->id,    $response->id);
        $this->assertEquals($item->id,      $response->item_id);
        $this->assertEquals('1',            $response->slug);
        $this->assertEquals('2',            $response->title);
        $this->assertEquals('3',            $response->body);
        $this->assertEquals('POINT(4 4)',   $response->coverage);
        $this->assertEquals('5',            $response->tags);
        $this->assertEquals('6',            $response->widgets);
        $this->assertEquals('7',            $response->presenter);
        $this->assertEquals('8',            $response->fill_color);
        $this->assertEquals('9',            $response->fill_color_select);
        $this->assertEquals('10',           $response->stroke_color);
        $this->assertEquals('11',           $response->stroke_color_select);
        $this->assertEquals(0.12,           $response->fill_opacity);
        $this->assertEquals(0.13,           $response->fill_opacity_select);
        $this->assertEquals(0.14,           $response->stroke_opacity);
        $this->assertEquals(0.15,           $response->stroke_opacity_select);
        $this->assertEquals(16,             $response->stroke_width);
        $this->assertEquals(17,             $response->point_radius);
        $this->assertEquals(18,             $response->zindex);
        $this->assertEquals(19,             $response->weight);
        $this->assertEquals('20',           $response->start_date);
        $this->assertEquals('21',           $response->end_date);
        $this->assertEquals('22',           $response->after_date);
        $this->assertEquals('23',           $response->before_date);
        $this->assertEquals('24',           $response->point_image);
        $this->assertEquals('25',           $response->wms_address);
        $this->assertEquals('26',           $response->wms_layers);
        $this->assertEquals(27,             $response->min_zoom);
        $this->assertEquals(28,             $response->max_zoom);
        $this->assertEquals(29,             $response->map_zoom);
        $this->assertEquals('30',           $response->map_focus);

    }


}
