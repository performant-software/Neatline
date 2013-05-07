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
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'widgets'           => '5',
            'presenter'         => '6',
            'fill_color'        => '7',
            'select_color'      => '8',
            'stroke_color'      => '9',
            'fill_opacity'      => '10',
            'select_opacity'    => '11',
            'stroke_opacity'    => '12',
            'stroke_width'      => '13',
            'point_radius'      => '14',
            'zindex'            => '15',
            'weight'            => '16',
            'start_date'        => '17',
            'end_date'          => '18',
            'after_date'        => '19',
            'before_date'       => '20',
            'point_image'       => '21',
            'min_zoom'          => '23',
            'max_zoom'          => '24',
            'map_zoom'          => '25',
            'map_focus'         => '26'
        ));

        $record->save();

        $this->writePut(array(
            'title'             => '2',
            'body'              => '3',
            'coverage'          => 'POINT(4 4)',
            'tags'              => '5',
            'widgets'           => array('6','7'),
            'presenter'         => '8',
            'fill_color'        => '9',
            'select_color'      => '10',
            'stroke_color'      => '11',
            'fill_opacity'      => '12',
            'select_opacity'    => '13',
            'stroke_opacity'    => '14',
            'stroke_width'      => '15',
            'point_radius'      => '16',
            'zindex'            => '17',
            'weight'            => '18',
            'start_date'        => '19',
            'end_date'          => '20',
            'after_date'        => '21',
            'before_date'       => '22',
            'point_image'       => '23',
            'min_zoom'          => '24',
            'max_zoom'          => '25',
            'map_zoom'          => '26',
            'map_focus'         => '27'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

        $this->assertEquals($record->title,             '2');
        $this->assertEquals($record->body,              '3');
        $this->assertEquals($record->coverage,          'POINT(4 4)');
        $this->assertEquals($record->tags,              '5');
        $this->assertEquals($record->widgets,           '6,7');
        $this->assertEquals($record->presenter,         '8');
        $this->assertEquals($record->fill_color,        '9');
        $this->assertEquals($record->select_color,      '10');
        $this->assertEquals($record->stroke_color,      '11');
        $this->assertEquals($record->fill_opacity,      12);
        $this->assertEquals($record->select_opacity,    13);
        $this->assertEquals($record->stroke_opacity,    14);
        $this->assertEquals($record->stroke_width,      15);
        $this->assertEquals($record->point_radius,      16);
        $this->assertEquals($record->zindex,            17);
        $this->assertEquals($record->weight,            18);
        $this->assertEquals($record->start_date,        '19');
        $this->assertEquals($record->end_date,          '20');
        $this->assertEquals($record->after_date,        '21');
        $this->assertEquals($record->before_date,       '22');
        $this->assertEquals($record->point_image,       '23');
        $this->assertEquals($record->min_zoom,          24);
        $this->assertEquals($record->max_zoom,          25);
        $this->assertEquals($record->map_zoom,          26);
        $this->assertEquals($record->map_focus,         '27');

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
