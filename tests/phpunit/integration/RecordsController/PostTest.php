<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for POST action in records API.
 *
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
    public function testPost()
    {

        $exhibit = $this->__exhibit();

        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'        => $exhibit->id,
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'widgets'           => array('5','6'),
            'presenter'         => '7',
            'fill_color'        => '8',
            'select_color'      => '9',
            'stroke_color'      => '10',
            'fill_opacity'      => '11',
            'select_opacity'    => '12',
            'stroke_opacity'    => '13',
            'stroke_width'      => '14',
            'point_radius'      => '15',
            'point_image'       => '16',
            'min_zoom'          => '17',
            'max_zoom'          => '18',
            'map_zoom'          => '19',
            'map_focus'         => '20',
            'wms_address'       => '21',
            'wms_layers'        => '22',
            'start_date'        => '23',
            'end_date'          => '24',
            'show_after_date'   => '25',
            'show_before_date'  => '26',
            'weight'            => '27'
        )));

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records');
        $c2 = $this->__records->count();

        // Should create a record.
        $this->assertEquals($c2, $c1+1);

        // Should emit new id.
        $response = $this->getResponseArray();
        $this->assertNotNull($response->id);

        // Load the new record.
        $record = $this->__records->find($response->id);

        // Should update fields.
        $this->assertEquals($record->exhibit_id,        $exhibit->id);
        $this->assertEquals($record->title,             '1');
        $this->assertEquals($record->body,              '2');
        $this->assertEquals($record->coverage,          'POINT(3 3)');
        $this->assertEquals($record->tags,              '4');
        $this->assertEquals($record->widgets,           '5,6');
        $this->assertEquals($record->presenter,         '7');
        $this->assertEquals($record->fill_color,        '8');
        $this->assertEquals($record->select_color,      '9');
        $this->assertEquals($record->stroke_color,      '10');
        $this->assertEquals($record->fill_opacity,      11);
        $this->assertEquals($record->select_opacity,    12);
        $this->assertEquals($record->stroke_opacity,    13);
        $this->assertEquals($record->stroke_width,      14);
        $this->assertEquals($record->point_radius,      15);
        $this->assertEquals($record->point_image,       '16');
        $this->assertEquals($record->min_zoom,          17);
        $this->assertEquals($record->max_zoom,          18);
        $this->assertEquals($record->map_zoom,          19);
        $this->assertEquals($record->map_focus,         '20');
        $this->assertEquals($record->wms_address,       '21');
        $this->assertEquals($record->wms_layers,        '22');
        $this->assertEquals($record->start_date,        '23');
        $this->assertEquals($record->end_date,          '24');
        $this->assertEquals($record->show_after_date,   '25');
        $this->assertEquals($record->show_before_date,  '26');
        $this->assertEquals($record->weight,            27);

    }


    /**
     * POST should update the `item_id` field.
     */
    public function testItemId()
    {

        $exhibit  = $this->__exhibit();
        $item     = $this->__item();

        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'    => $exhibit->id,
            'item_id'       => $item->id
        )));

        $this->dispatch('neatline/records');
        $record = $this->getLastRow($this->__records);

        // Should update `item_id`.
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * POST should return all record attributes.
     */
    public function testReturnRecord()
    {

        $exhibit = $this->__exhibit();

        // New record data.
        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id' => $exhibit->id
        )));

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
