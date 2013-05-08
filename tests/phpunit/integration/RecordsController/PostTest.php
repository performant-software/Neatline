<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class RecordsControllerTest_Post extends Neatline_TestCase
{


    /**
     * POST should create a new record and respond with the new id.
     */
    public function testCreateRecord()
    {

        $exhibit = $this->__exhibit();

        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode(array(
                'exhibit_id'            => $exhibit->id,
                'slug'                  => '1',
                'title'                 => '2',
                'body'                  => '3',
                'coverage'              => 'POINT(4 4)',
                'tags'                  => '5',
                'widgets'               => array('6','7'),
                'presenter'             => '8',
                'fill_color'            => '9',
                'fill_color_select'     => '10',
                'stroke_color'          => '11',
                'stroke_color_select'   => '12',
                'fill_opacity'          => '0.13',
                'fill_opacity_select'   => '0.14',
                'stroke_opacity'        => '0.15',
                'stroke_opacity_select' => '0.16',
                'stroke_width'          => '17',
                'point_radius'          => '18',
                'zindex'                => '19',
                'weight'                => '20',
                'start_date'            => '21',
                'end_date'              => '22',
                'after_date'            => '23',
                'before_date'           => '24',
                'point_image'           => '25',
                'min_zoom'              => '26',
                'max_zoom'              => '27',
                'map_zoom'              => '28',
                'map_focus'             => '29'
            )
        ));

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records');
        $c2 = $this->__records->count();

        // Should create new record.
        $this->assertEquals($c2, $c1+1);

        // Should emit new id.
        $response = $this->getResponseArray();
        $this->assertNotNull($response->id);

        // Load the new record.
        $r = $this->__records->find($response->id);

        // Should update fields.
        $this->assertEquals($r->exhibit_id,             $exhibit->id);
        $this->assertEquals($r->slug,                   '1');
        $this->assertEquals($r->title,                  '2');
        $this->assertEquals($r->body,                   '3');
        $this->assertEquals($r->coverage,               'POINT(4 4)');
        $this->assertEquals($r->tags,                   '5');
        $this->assertEquals($r->widgets,                '6,7');
        $this->assertEquals($r->presenter,              '8');
        $this->assertEquals($r->fill_color,             '9');
        $this->assertEquals($r->fill_color_select,      '10');
        $this->assertEquals($r->stroke_color,           '11');
        $this->assertEquals($r->stroke_color_select,    '12');
        $this->assertEquals($r->fill_opacity,           0.13);
        $this->assertEquals($r->fill_opacity_select,    0.14);
        $this->assertEquals($r->stroke_opacity,         0.15);
        $this->assertEquals($r->stroke_opacity_select,  0.16);
        $this->assertEquals($r->stroke_width,           17);
        $this->assertEquals($r->point_radius,           18);
        $this->assertEquals($r->zindex,                 19);
        $this->assertEquals($r->weight,                 20);
        $this->assertEquals($r->start_date,             '21');
        $this->assertEquals($r->end_date,               '22');
        $this->assertEquals($r->after_date,             '23');
        $this->assertEquals($r->before_date,            '24');
        $this->assertEquals($r->point_image,            '25');
        $this->assertEquals($r->min_zoom,               26);
        $this->assertEquals($r->max_zoom,               27);
        $this->assertEquals($r->map_zoom,               28);
        $this->assertEquals($r->map_focus,              '29');

    }


    /**
     * POST should set the `item_id` field.
     */
    public function testSetItemId()
    {

        $item = $this->__item();
        $exhibit = $this->__exhibit();

        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode(array(
                'exhibit_id'    => $exhibit->id,
                'item_id'       => $item->id
            )
        ));

        $this->dispatch('neatline/records');
        $record = $this->getLastRow($this->__records);

        // Should update `item_id`.
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * POST should set the `wms_address` and `wms_layers` fields.
     */
    public function testSetWmsFields()
    {

        $exhibit = $this->__exhibit();

        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode(array(
                'exhibit_id'    => $exhibit->id,
                'wms_address'   => '1',
                'wms_layers'    => '2',
            )
        ));

        $this->dispatch('neatline/records');
        $record = $this->getLastRow($this->__records);

        // Should update WMS address/layers.
        $this->assertEquals($record->wms_address, '1');
        $this->assertEquals($record->wms_layers, '2');

    }


    /**
     * POST should respond with all record attributes.
     */
    public function testResponse()
    {

        $exhibit = $this->__exhibit();

        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode(array(
                'exhibit_id' => $exhibit->id
            )
        ));

        $this->dispatch('neatline/records');
        $response = $this->getResponseArray();

        // Get the new record.
        $record = $this->getLastRow($this->__records);

        // Should emit all attributes.
        foreach (array_keys($record->toArray()) as $k) {
            $this->assertObjectHasAttribute($k, $response);
        }

    }


}
