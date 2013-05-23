<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Get extends Neatline_DefaultCase
{


    /**
     * GET should emit a JSON representation of a single record.
     */
    public function testGet()
    {

        $exhibit    = $this->__exhibit();
        $item       = $this->__item();
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
        $r = $this->getResponseArray();

        $this->assertEquals($r->id,                     $record->id);
        $this->assertEquals($r->item_id,                $item->id);
        $this->assertEquals($r->slug,                   '1');
        $this->assertEquals($r->title,                  '2');
        $this->assertEquals($r->body,                   '3');
        $this->assertEquals($r->coverage,               'POINT(4 4)');
        $this->assertEquals($r->tags,                   '5');
        $this->assertEquals($r->widgets,                '6');
        $this->assertEquals($r->presenter,              '7');
        $this->assertEquals($r->fill_color,             '8');
        $this->assertEquals($r->fill_color_select,      '9');
        $this->assertEquals($r->stroke_color,           '10');
        $this->assertEquals($r->stroke_color_select,    '11');
        $this->assertEquals($r->fill_opacity,           0.12);
        $this->assertEquals($r->fill_opacity_select,    0.13);
        $this->assertEquals($r->stroke_opacity,         0.14);
        $this->assertEquals($r->stroke_opacity_select,  0.15);
        $this->assertEquals($r->stroke_width,           16);
        $this->assertEquals($r->point_radius,           17);
        $this->assertEquals($r->zindex,                 18);
        $this->assertEquals($r->weight,                 19);
        $this->assertEquals($r->start_date,             '20');
        $this->assertEquals($r->end_date,               '21');
        $this->assertEquals($r->after_date,             '22');
        $this->assertEquals($r->before_date,            '23');
        $this->assertEquals($r->point_image,            '24');
        $this->assertEquals($r->wms_address,            '25');
        $this->assertEquals($r->wms_layers,             '26');
        $this->assertEquals($r->min_zoom,               27);
        $this->assertEquals($r->max_zoom,               28);
        $this->assertEquals($r->map_zoom,               29);
        $this->assertEquals($r->map_focus,              '30');

    }


}
