<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm()` on NeatlineRecord.
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
     * --------------------------------------------------------------------
     * saveForm() should update fields to match the key => value pairs in
     * the input array.
     * --------------------------------------------------------------------
     */
    public function testUpdate()
    {

        // Create record.
        $record = $this->__record();

        // Mock values:
        $values = array(

            'slug'              => '1',
            'title'             => '2',
            'coverage'          => 'POINT(1 1)',
            'body'              => '3',
            'tags'              => '4',
            'map_focus'         => '5',
            'map_zoom'          => 6,

            'vector_color'      => '7',
            'stroke_color'      => '8',
            'select_color'      => '9',
            'vector_opacity'    => 10,
            'select_opacity'    => 11,
            'stroke_opacity'    => 12,
            'image_opacity'     => 13,
            'stroke_width'      => 14,
            'point_radius'      => 15,
            'point_image'       => '16',
            'max_zoom'          => 17,
            'min_zoom'          => 18

        );

        // Update.
        $record->saveForm($values);

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Data fields updated.
        $this->assertEquals($record->slug,              '1');
        $this->assertEquals($record->title,             '2');
        $this->assertEquals($record->body,              '3');
        $this->assertEquals($record->coverage,          'POINT(1 1)');
        $this->assertEquals($record->tags,              '4');
        $this->assertEquals($record->map_focus,         '5');
        $this->assertEquals($record->map_zoom,          6);

        // Tag fields set.
        $this->assertEquals($record->vector_color,      '7');
        $this->assertEquals($record->stroke_color,      '8');
        $this->assertEquals($record->select_color,      '9');
        $this->assertEquals($record->vector_opacity,    10);
        $this->assertEquals($record->select_opacity,    11);
        $this->assertEquals($record->stroke_opacity,    12);
        $this->assertEquals($record->image_opacity,     13);
        $this->assertEquals($record->stroke_width,      14);
        $this->assertEquals($record->point_radius,      15);
        $this->assertEquals($record->point_image,       '16');
        $this->assertEquals($record->max_zoom,          17);
        $this->assertEquals($record->min_zoom,          18);

    }


    /**
     * --------------------------------------------------------------------
     * saveForm() should set empty strings as null.
     * --------------------------------------------------------------------
     */
    public function testEmptyValueBlocking()
    {

        // Create record.
        $record = $this->__record();

        // Set empty string.
        $record->saveForm(array('title' => ''));
        $this->assertNull($record->title);

        // Set un-trimmed empty string.
        $record->saveForm(array('title' => ' '));
        $this->assertNull($record->title);

    }


}
