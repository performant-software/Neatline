<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for PUT action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Put extends Neatline_TestCase
{


    /**
     * PUT should update a record.
     */
    public function testPut()
    {

        $record = $this->__record();

        $record->widgets            = '1';
        $record->title              = '2';
        $record->body               = '3';
        $record->coverage           = 'POINT(4 4)';
        $record->tags               = '5';
        $record->presenter          = '6';
        $record->fill_color         = '7';
        $record->select_color       = '8';
        $record->stroke_color       = '9';
        $record->fill_opacity       = 10;
        $record->select_opacity     = 11;
        $record->stroke_opacity     = 12;
        $record->stroke_width       = 13;
        $record->point_radius       = 14;
        $record->point_image        = '15';
        $record->min_zoom           = 16;
        $record->max_zoom           = 17;
        $record->map_zoom           = 18;
        $record->map_focus          = '19';
        $record->wms_address        = '20';
        $record->wms_layers         = '21';
        $record->start_date         = '22';
        $record->end_date           = '23';
        $record->start_show_date    = '24';
        $record->end_show_date      = '25';
        $record->weight             = 26;
        $record->save();

        $values = array(
            'widgets'           => '27',
            'title'             => '28',
            'body'              => '29',
            'coverage'          => 'POINT(30 30)',
            'tags'              => '31',
            'presenter'         => '32',
            'fill_color'        => '33',
            'select_color'      => '34',
            'stroke_color'      => '35',
            'fill_opacity'      => '36',
            'select_opacity'    => '37',
            'stroke_opacity'    => '38',
            'stroke_width'      => '39',
            'point_radius'      => '40',
            'point_image'       => '41',
            'min_zoom'          => '42',
            'max_zoom'          => '43',
            'map_zoom'          => '44',
            'map_focus'         => '45',
            'wms_address'       => '46',
            'wms_layers'        => '47',
            'start_date'        => '48',
            'end_date'          => '49',
            'start_show_date'   => '50',
            'end_show_date'     => '51',
            'weight'            => '52'
        );

        $this->writePut($values);
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update fields.
        $this->assertEquals($record->widgets,           '27');
        $this->assertEquals($record->title,             '28');
        $this->assertEquals($record->body,              '29');
        $this->assertEquals($record->coverage,          'POINT(30 30)');
        $this->assertEquals($record->tags,              '31');
        $this->assertEquals($record->presenter,         '32');
        $this->assertEquals($record->fill_color,        '33');
        $this->assertEquals($record->select_color,      '34');
        $this->assertEquals($record->stroke_color,      '35');
        $this->assertEquals($record->fill_opacity,      36);
        $this->assertEquals($record->select_opacity,    37);
        $this->assertEquals($record->stroke_opacity,    38);
        $this->assertEquals($record->stroke_width,      39);
        $this->assertEquals($record->point_radius,      40);
        $this->assertEquals($record->point_image,       '41');
        $this->assertEquals($record->min_zoom,          42);
        $this->assertEquals($record->max_zoom,          43);
        $this->assertEquals($record->map_zoom,          44);
        $this->assertEquals($record->map_focus,         '45');
        $this->assertEquals($record->wms_address,       '46');
        $this->assertEquals($record->wms_layers,        '47');
        $this->assertEquals($record->start_date,        '48');
        $this->assertEquals($record->end_date,          '49');
        $this->assertEquals($record->start_show_date,   '50');
        $this->assertEquals($record->end_show_date,     '51');
        $this->assertEquals($record->weight,            52);

    }


    /**
     * PUT should update the `item_id` field.
     */
    public function testItemId()
    {

        $item   = $this->__item();
        $record = $this->__record();

        $this->writePut(array('item_id' => $item->id));
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update `item_id`.
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * PUT should return all record attributes.
     */
    public function testReturnRecord()
    {

        $exhibit = $this->__exhibit();
        $record = $this->__record($exhibit);

        $this->writePut(array());
        $this->dispatch('neatline/records/'.$record->id);
        $response = $this->getResponseArray();

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertObjectHasAttribute($k, $response);
        }

    }


}
