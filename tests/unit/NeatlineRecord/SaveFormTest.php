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

        $values = array(
            'item_id'           => 1,
            'title'             => '2',
            'body'              => '3',
            'coverage'          => 'POINT(4 4)',
            'slug'              => '5',
            'tags'              => '6',
            'map_focus'         => '7',
            'map_zoom'          => 8,
            'vector_color'      => '9',
            'stroke_color'      => '10',
            'select_color'      => '11',
            'vector_opacity'    => 12,
            'select_opacity'    => 13,
            'stroke_opacity'    => 14,
            'image_opacity'     => 15,
            'stroke_width'      => 16,
            'point_radius'      => 17,
            'point_image'       => '18',
            'max_zoom'          => 19,
            'min_zoom'          => 20
        );

        $record->saveForm($values);
        $record = $this->_recordsTable->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->title,             '2');
        $this->assertEquals($record->body,              '3');
        $this->assertEquals($record->coverage,          'POINT(4 4)');
        $this->assertEquals($record->slug,              '5');
        $this->assertEquals($record->tags,              '6');
        $this->assertEquals($record->map_focus,         '7');
        $this->assertEquals($record->map_zoom,          8);
        $this->assertEquals($record->vector_color,      '9');
        $this->assertEquals($record->stroke_color,      '10');
        $this->assertEquals($record->select_color,      '11');
        $this->assertEquals($record->vector_opacity,    12);
        $this->assertEquals($record->select_opacity,    13);
        $this->assertEquals($record->stroke_opacity,    14);
        $this->assertEquals($record->image_opacity,     15);
        $this->assertEquals($record->stroke_width,      16);
        $this->assertEquals($record->point_radius,      17);
        $this->assertEquals($record->point_image,       '18');
        $this->assertEquals($record->max_zoom,          19);
        $this->assertEquals($record->min_zoom,          20);

    }


    /**
     * `saveForm` should set empty strings as null.
     */
    public function testEmptyValueBlocking()
    {

        $record = $this->__record();

        // Empty string:
        $record->saveForm(array('title' => ''));
        $this->assertNull($record->title);

        // Un-trimmed empty string:
        $record->saveForm(array('title' => ' '));
        $this->assertNull($record->title);

    }


}
