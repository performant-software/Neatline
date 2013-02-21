<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_SaveForm
    extends Neatline_Test_AppTestCase
{


    /**
     * `saveForm` should update fields to match the input array.
     */
    public function testUpdate()
    {

        $record = $this->__record();

        $record->saveForm(array(
            'item_id'           => '1',
            'title'             => '2',
            'body'              => '3',
            'coverage'          => 'POINT(4 4)',
            'tags'              => '5',
            'map_focus'         => '6',
            'map_zoom'          => '7',
            'presenter'         => '8',
            'vector_color'      => '9',
            'stroke_color'      => '10',
            'select_color'      => '11',
            'vector_opacity'    => '12',
            'select_opacity'    => '13',
            'stroke_opacity'    => '14',
            'stroke_width'      => '15',
            'point_radius'      => '16',
            'point_image'       => '17',
            'max_zoom'          => '18',
            'min_zoom'          => '19'
        ));

        $record = $this->_recordsTable->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->title,             '2');
        $this->assertEquals($record->body,              '3');
        $this->assertEquals($record->coverage,          'POINT(4 4)');
        $this->assertEquals($record->tags,              '5');
        $this->assertEquals($record->map_focus,         '6');
        $this->assertEquals($record->map_zoom,          7);
        $this->assertEquals($record->presenter,         '8');
        $this->assertEquals($record->vector_color,      '9');
        $this->assertEquals($record->stroke_color,      '10');
        $this->assertEquals($record->select_color,      '11');
        $this->assertEquals($record->vector_opacity,    12);
        $this->assertEquals($record->select_opacity,    13);
        $this->assertEquals($record->stroke_opacity,    14);
        $this->assertEquals($record->stroke_width,      15);
        $this->assertEquals($record->point_radius,      16);
        $this->assertEquals($record->point_image,       '17');
        $this->assertEquals($record->max_zoom,          18);
        $this->assertEquals($record->min_zoom,          19);

    }


    /**
     * `saveForm` should set empty/whitespace strings as `null`.
     */
    public function testWhitespaceBlocking()
    {

        $record = $this->__record();

        // String field.
        $record->saveForm(array('title' => ''));
        $this->assertNull($record->title);
        $record->saveForm(array('title' => ' '));
        $this->assertNull($record->title);

        // Number field.
        $record->saveForm(array('max_zoom' => ''));
        $this->assertNull($record->max_zoom);
        $record->saveForm(array('max_zoom' => ' '));
        $this->assertNull($record->max_zoom);

    }


}
