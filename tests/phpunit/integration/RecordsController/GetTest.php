<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Get extends Neatline_TestCase
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
            'slug'              => '1',
            'title'             => '2',
            'body'              => '3',
            'coverage'          => 'POINT(4 4)',
            'tags'              => '5',
            'widgets'           => '6',
            'presenter'         => '7',
            'fill_color'        => '8',
            'select_color'      => '9',
            'stroke_color'      => '10',
            'fill_opacity'      => 11,
            'select_opacity'    => 12,
            'stroke_opacity'    => 13,
            'stroke_width'      => 14,
            'point_radius'      => 15,
            'zindex'            => 16,
            'weight'            => 17,
            'start_date'        => '18',
            'end_date'          => '19',
            'after_date'        => '20',
            'before_date'       => '21',
            'point_image'       => '22',
            'wms_address'       => '23',
            'wms_layers'        => '24',
            'min_zoom'          => 25,
            'max_zoom'          => 26,
            'map_zoom'          => 27,
            'map_focus'         => '28'
        ));

        $record->__save();

        $this->dispatch('neatline/records/'.$record->id);
        $response = $this->getResponseArray();

        $this->assertEquals($response->id,              $record->id);
        $this->assertEquals($response->item_id,         $item->id);
        $this->assertEquals($response->slug,            '1');
        $this->assertEquals($response->title,           '2');
        $this->assertEquals($response->body,            '3');
        $this->assertEquals($response->coverage,        'POINT(4 4)');
        $this->assertEquals($response->tags,            '5');
        $this->assertEquals($response->widgets,         '6');
        $this->assertEquals($response->presenter,       '7');
        $this->assertEquals($response->fill_color,      '8');
        $this->assertEquals($response->select_color,    '9');
        $this->assertEquals($response->stroke_color,    '10');
        $this->assertEquals($response->fill_opacity,    11);
        $this->assertEquals($response->select_opacity,  12);
        $this->assertEquals($response->stroke_opacity,  13);
        $this->assertEquals($response->stroke_width,    14);
        $this->assertEquals($response->point_radius,    15);
        $this->assertEquals($response->zindex,          16);
        $this->assertEquals($response->weight,          17);
        $this->assertEquals($response->start_date,      '18');
        $this->assertEquals($response->end_date,        '19');
        $this->assertEquals($response->after_date,      '20');
        $this->assertEquals($response->before_date,     '21');
        $this->assertEquals($response->point_image,     '22');
        $this->assertEquals($response->wms_address,     '23');
        $this->assertEquals($response->wms_layers,      '24');
        $this->assertEquals($response->min_zoom,        25);
        $this->assertEquals($response->max_zoom,        26);
        $this->assertEquals($response->map_zoom,        27);
        $this->assertEquals($response->map_focus,       '28');

    }


}
