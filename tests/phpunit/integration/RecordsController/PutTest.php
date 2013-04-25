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
            'show_after_date'   => '22',
            'show_before_date'  => '23',
            'weight'            => 24
        ));

        $this->writePut(array(
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
            'start_date'        => '47',
            'end_date'          => '48',
            'show_after_date'   => '49',
            'show_before_date'  => '50',
            'weight'            => '51'
        ));

        $this->dispatch('neatline/records/'.$record->id);
        $record = $this->reload($record);

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
        $this->assertEquals($record->start_date,        '47');
        $this->assertEquals($record->end_date,          '48');
        $this->assertEquals($record->show_after_date,   '49');
        $this->assertEquals($record->show_before_date,  '50');
        $this->assertEquals($record->weight,            51);

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
