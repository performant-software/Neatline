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
        $record->presenter          = '5';
        $record->fill_color         = '6';
        $record->select_color       = '7';
        $record->stroke_color       = '8';
        $record->fill_opacity       = 9;
        $record->select_opacity     = 10;
        $record->stroke_opacity     = 11;
        $record->stroke_width       = 12;
        $record->point_radius       = 13;
        $record->point_image        = '14';
        $record->min_zoom           = 15;
        $record->max_zoom           = 16;
        $record->map_focus          = '17';
        $record->map_zoom           = 18;
        $record->save();

        $values = array(
            'title'                 => '19',
            'body'                  => '20',
            'coverage'              => 'POINT(21 21)',
            'tags'                  => '22',
            'presenter'             => '23',
            'fill_color'            => '24',
            'select_color'          => '25',
            'stroke_color'          => '26',
            'fill_opacity'          => '27',
            'select_opacity'        => '28',
            'stroke_opacity'        => '29',
            'stroke_width'          => '30',
            'point_radius'          => '31',
            'point_image'           => '32',
            'min_zoom'              => '33',
            'max_zoom'              => '34',
            'map_focus'             => '35',
            'map_zoom'              => '36'
        );

        $this->writePut($values);
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update fields.
        $this->assertEquals($record->title,             '19');
        $this->assertEquals($record->body,              '20');
        $this->assertEquals($record->coverage,          'POINT(21 21)');
        $this->assertEquals($record->tags,              '22');
        $this->assertEquals($record->presenter,         '23');
        $this->assertEquals($record->fill_color,        '24');
        $this->assertEquals($record->select_color,      '25');
        $this->assertEquals($record->stroke_color,      '26');
        $this->assertEquals($record->fill_opacity,      27);
        $this->assertEquals($record->select_opacity,    28);
        $this->assertEquals($record->stroke_opacity,    29);
        $this->assertEquals($record->stroke_width,      30);
        $this->assertEquals($record->point_radius,      31);
        $this->assertEquals($record->point_image,       '32');
        $this->assertEquals($record->min_zoom,          33);
        $this->assertEquals($record->max_zoom,          34);
        $this->assertEquals($record->map_focus,         '35');
        $this->assertEquals($record->map_zoom,          36);

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
