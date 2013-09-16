<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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
        $r = $this->_getResponseArray();

        $this->assertEquals($record->id,    $r->id);
        $this->assertEquals($item->id,      $r->item_id);
        $this->assertEquals('1',            $r->slug);
        $this->assertEquals('2',            $r->title);
        $this->assertEquals('3',            $r->body);
        $this->assertEquals('POINT(4 4)',   $r->coverage);
        $this->assertEquals('5',            $r->tags);
        $this->assertEquals('6',            $r->widgets);
        $this->assertEquals('7',            $r->presenter);
        $this->assertEquals('8',            $r->fill_color);
        $this->assertEquals('9',            $r->fill_color_select);
        $this->assertEquals('10',           $r->stroke_color);
        $this->assertEquals('11',           $r->stroke_color_select);
        $this->assertEquals(0.12,           $r->fill_opacity);
        $this->assertEquals(0.13,           $r->fill_opacity_select);
        $this->assertEquals(0.14,           $r->stroke_opacity);
        $this->assertEquals(0.15,           $r->stroke_opacity_select);
        $this->assertEquals(16,             $r->stroke_width);
        $this->assertEquals(17,             $r->point_radius);
        $this->assertEquals(18,             $r->zindex);
        $this->assertEquals(19,             $r->weight);
        $this->assertEquals('20',           $r->start_date);
        $this->assertEquals('21',           $r->end_date);
        $this->assertEquals('22',           $r->after_date);
        $this->assertEquals('23',           $r->before_date);
        $this->assertEquals('24',           $r->point_image);
        $this->assertEquals('25',           $r->wms_address);
        $this->assertEquals('26',           $r->wms_layers);
        $this->assertEquals(27,             $r->min_zoom);
        $this->assertEquals(28,             $r->max_zoom);
        $this->assertEquals(29,             $r->map_zoom);
        $this->assertEquals('30',           $r->map_focus);

    }


}
