<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for POST action in record API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordControllerTest_Post
    extends Neatline_Test_AppTestCase
{


    /**
     * POST should create a new record and respond with the new id.
     */
    public function testPost()
    {

        $exhibit = $this->__exhibit();

        // New record data.
        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'        => $exhibit->id,
            'item_id'           => '1',
            'title'             => '2',
            'body'              => '3',
            'coverage'          => 'POINT(4 4)',
            'tags'              => '5',
            'vector_color'      => '6',
            'stroke_color'      => '7',
            'select_color'      => '8',
            'vector_opacity'    => '9',
            'select_opacity'    => '10',
            'stroke_opacity'    => '11',
            'image_opacity'     => '12',
            'stroke_width'      => '13',
            'point_radius'      => '14',
            'point_image'       => '15',
            'min_zoom'          => '16',
            'max_zoom'          => '17',
            'map_focus'         => '18',
            'map_zoom'          => '19'
        )));

        // Hit /records with POST.
        $c1 = $this->_recordsTable->count();
        $this->dispatch('neatline/record');
        $c2 = $this->_recordsTable->count();
        $this->assertResponseCode(200);

        // Should create a record.
        $this->assertEquals($c2, $c1+1);

        // Should emit new id.
        $response = $this->getResponseArray();
        $this->assertNotNull($response->id);

        // Load the record.
        $record = $this->_recordsTable->find($response->id);

        // Should update fields.
        $this->assertEquals($record->exhibit_id,        $exhibit->id);
        $this->assertEquals($record->item_id,           '1');
        $this->assertEquals($record->title,             '2');
        $this->assertEquals($record->body,              '3');
        $this->assertEquals($record->coverage,          'POINT(4 4)');
        $this->assertEquals($record->tags,              '5');
        $this->assertEquals($record->vector_color,      '6');
        $this->assertEquals($record->stroke_color,      '7');
        $this->assertEquals($record->select_color,      '8');
        $this->assertEquals($record->vector_opacity,    9);
        $this->assertEquals($record->select_opacity,    10);
        $this->assertEquals($record->stroke_opacity,    11);
        $this->assertEquals($record->image_opacity,     12);
        $this->assertEquals($record->stroke_width,      13);
        $this->assertEquals($record->point_radius,      14);
        $this->assertEquals($record->point_image,       '15');
        $this->assertEquals($record->min_zoom,          16);
        $this->assertEquals($record->max_zoom,          17);
        $this->assertEquals($record->map_focus,         '18');
        $this->assertEquals($record->map_zoom,          19);

    }


    /**
     * PUT should synchronize record styles with tag siblings.
     */
    public function testSynchronizeStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag';
        $record1->save();

        // Exhibit YAML.
        $exhibit->styles = "
        tag:
         - vector_color
        ";

        $exhibit->save();

        // New record data.
        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'    => $exhibit->id,
            'vector_color'  => 'color',
            'tags'          => 'tag'
        )));

        // Save the new record.
        $this->dispatch('neatline/record');

        // Record 1 should be synchronized with new record.
        $record1 = $this->_recordsTable->find($record1->id);
        $this->assertEquals($record1->vector_color, 'color');

    }


}
