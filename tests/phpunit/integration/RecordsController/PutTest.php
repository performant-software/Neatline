<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
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
    public function testUpdateRecord()
    {

        $record = $this->__record();

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
            'fill_opacity'      => '11',
            'select_opacity'    => '12',
            'stroke_opacity'    => '13',
            'stroke_width'      => '14',
            'point_radius'      => '15',
            'zindex'            => '16',
            'weight'            => '17',
            'start_date'        => '18',
            'end_date'          => '19',
            'after_date'        => '20',
            'before_date'       => '21',
            'point_image'       => '22',
            'min_zoom'          => '23',
            'max_zoom'          => '24',
            'map_zoom'          => '25',
            'map_focus'         => '26'
        ));

        $record->save();

        $this->writePut(array(
            'slug'              => '2',
            'title'             => '3',
            'body'              => '4',
            'coverage'          => 'POINT(5 5)',
            'tags'              => '6',
            'widgets'           => array('7','8'),
            'presenter'         => '9',
            'fill_color'        => '10',
            'select_color'      => '11',
            'stroke_color'      => '12',
            'fill_opacity'      => '13',
            'select_opacity'    => '14',
            'stroke_opacity'    => '15',
            'stroke_width'      => '16',
            'point_radius'      => '17',
            'zindex'            => '18',
            'weight'            => '19',
            'start_date'        => '20',
            'end_date'          => '21',
            'after_date'        => '22',
            'before_date'       => '23',
            'point_image'       => '24',
            'min_zoom'          => '25',
            'max_zoom'          => '26',
            'map_zoom'          => '27',
            'map_focus'         => '28'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        $this->assertEquals($record->slug,              '2');
        $this->assertEquals($record->title,             '3');
        $this->assertEquals($record->body,              '4');
        $this->assertEquals($record->coverage,          'POINT(5 5)');
        $this->assertEquals($record->tags,              '6');
        $this->assertEquals($record->widgets,           '7,8');
        $this->assertEquals($record->presenter,         '9');
        $this->assertEquals($record->fill_color,        '10');
        $this->assertEquals($record->select_color,      '11');
        $this->assertEquals($record->stroke_color,      '12');
        $this->assertEquals($record->fill_opacity,      13);
        $this->assertEquals($record->select_opacity,    14);
        $this->assertEquals($record->stroke_opacity,    15);
        $this->assertEquals($record->stroke_width,      16);
        $this->assertEquals($record->point_radius,      17);
        $this->assertEquals($record->zindex,            18);
        $this->assertEquals($record->weight,            19);
        $this->assertEquals($record->start_date,        '20');
        $this->assertEquals($record->end_date,          '21');
        $this->assertEquals($record->after_date,        '22');
        $this->assertEquals($record->before_date,       '23');
        $this->assertEquals($record->point_image,       '24');
        $this->assertEquals($record->min_zoom,          25);
        $this->assertEquals($record->max_zoom,          26);
        $this->assertEquals($record->map_zoom,          27);
        $this->assertEquals($record->map_focus,         '28');

    }


    /**
     * PUT should update the `item_id` field.
     */
    public function testUpdateItemId()
    {

        $item = $this->__item();
        $record = $this->__record();

        $this->writePut(array('item_id' => $item->id));
        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update `item_id`.
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * PUT should update the `wms_address` and `wms_layers` fields.
     */
    public function testUpdateWmsFields()
    {

        $record = $this->__record();

        $record->setArray(array(
            'item_id'       => '1',
            'wms_address'   => '2',
            'wms_layers'    => '3'
        ));

        $record->save();

        $this->writePut(array(
            'wms_address'   => '3',
            'wms_layers'    => '4'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        // Should update WMS address/layers.
        $this->assertEquals($record->wms_address, '3');
        $this->assertEquals($record->wms_layers, '4');

    }


    /**
     * PUT should respond with all record attributes.
     */
    public function testResponse()
    {

        $record = $this->__record();

        $this->writePut();
        $this->dispatch('neatline/records/'.$record->id);
        $response = $this->getResponseArray();

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertObjectHasAttribute($k, $response);
        }

    }


}
