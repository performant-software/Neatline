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
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'widgets'           => '5',
            'presenter'         => '6',
            'fill_color'        => '7',
            'select_color'      => '8',
            'stroke_color'      => '9',
            'fill_opacity'      => 10,
            'select_opacity'    => 11,
            'stroke_opacity'    => 12,
            'stroke_width'      => 13,
            'point_radius'      => 14,
            'point_image'       => '15',
            'min_zoom'          => 16,
            'max_zoom'          => 17,
            'map_zoom'          => 18,
            'map_focus'         => '19',
            'start_date'        => '20',
            'end_date'          => '21',
            'after_date'        => '22',
            'before_date'       => '23',
            'weight'            => 24
        ));

        $record->__save();

        $this->dispatch('neatline/records/'.$record->id);
        $response = $this->getResponseArray();

        $this->assertEquals($response->id,              $record->id);
        $this->assertEquals($response->item_id,         $item->id);
        $this->assertEquals($response->title,           '1');
        $this->assertEquals($response->body,            '2');
        $this->assertEquals($response->coverage,        'POINT(3 3)');
        $this->assertEquals($response->tags,            '4');
        $this->assertEquals($response->widgets,         '5');
        $this->assertEquals($response->presenter,       '6');
        $this->assertEquals($response->fill_color,      '7');
        $this->assertEquals($response->select_color,    '8');
        $this->assertEquals($response->stroke_color,    '9');
        $this->assertEquals($response->fill_opacity,    10);
        $this->assertEquals($response->select_opacity,  11);
        $this->assertEquals($response->stroke_opacity,  12);
        $this->assertEquals($response->stroke_width,    13);
        $this->assertEquals($response->point_radius,    14);
        $this->assertEquals($response->point_image,     '15');
        $this->assertEquals($response->min_zoom,        16);
        $this->assertEquals($response->max_zoom,        17);
        $this->assertEquals($response->map_zoom,        18);
        $this->assertEquals($response->map_focus,       '19');
        $this->assertEquals($response->start_date,      '20');
        $this->assertEquals($response->end_date,        '21');
        $this->assertEquals($response->after_date,      '22');
        $this->assertEquals($response->before_date,     '23');
        $this->assertEquals($response->weight,          24);

    }


}
