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

        $record->title              = '1';
        $record->body               = '2';
        $record->coverage           = 'POINT(3 3)';
        $record->tags               = '4';
        $record->widgets            = '5';
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
        $record->show_after_date    = '24';
        $record->show_before_date   = '25';
        $record->weight             = 26;
        $record->save();

        $values = array(
            'title'             => '27',
            'body'              => '28',
            'coverage'          => 'POINT(29 29)',
            'tags'              => '30',
            'widgets'           => array('31','32'),
            'presenter'         => '33',
            'fill_color'        => '34',
            'select_color'      => '35',
            'stroke_color'      => '36',
            'fill_opacity'      => '37',
            'select_opacity'    => '38',
            'stroke_opacity'    => '39',
            'stroke_width'      => '40',
            'point_radius'      => '41',
            'point_image'       => '42',
            'min_zoom'          => '43',
            'max_zoom'          => '44',
            'map_zoom'          => '45',
            'map_focus'         => '46',
            'wms_address'       => '47',
            'wms_layers'        => '48',
            'start_date'        => '49',
            'end_date'          => '50',
            'show_after_date'   => '51',
            'show_before_date'  => '52',
            'weight'            => '53'
        );

        $this->writePut($values);
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update fields.
        $this->assertEquals($record->title,             '27');
        $this->assertEquals($record->body,              '28');
        $this->assertEquals($record->coverage,          'POINT(29 29)');
        $this->assertEquals($record->tags,              '30');
        $this->assertEquals($record->widgets,           '31,32');
        $this->assertEquals($record->presenter,         '33');
        $this->assertEquals($record->fill_color,        '34');
        $this->assertEquals($record->select_color,      '35');
        $this->assertEquals($record->stroke_color,      '36');
        $this->assertEquals($record->fill_opacity,      37);
        $this->assertEquals($record->select_opacity,    38);
        $this->assertEquals($record->stroke_opacity,    39);
        $this->assertEquals($record->stroke_width,      40);
        $this->assertEquals($record->point_radius,      41);
        $this->assertEquals($record->point_image,       '42');
        $this->assertEquals($record->min_zoom,          43);
        $this->assertEquals($record->max_zoom,          44);
        $this->assertEquals($record->map_zoom,          45);
        $this->assertEquals($record->map_focus,         '46');
        $this->assertEquals($record->wms_address,       '47');
        $this->assertEquals($record->wms_layers,        '48');
        $this->assertEquals($record->start_date,        '49');
        $this->assertEquals($record->end_date,          '50');
        $this->assertEquals($record->show_after_date,   '51');
        $this->assertEquals($record->show_before_date,  '52');
        $this->assertEquals($record->weight,            53);

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
