<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `update()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Update
    extends Neatline_Test_AppTestCase
{


    /**
     * update() should set non-style fields, create/update the record's
     * style tag, and update the tag key references.
     *
     * @group tags
     */
    public function testUpdate()
    {

        // Create record.
        $exhibit = $this->__exhibit();
        $record = $this->__record($exhibit);

        // Mock values:
        $values = array(

            'slug'          => 'slug',
            'title'         => 'title',
            'body'          => 'body',
            'tags'          => 'tag1,tag2',
            'coverage'      => 'POINT(1 1)',
            'map_active'    => 4,
            'map_focus'     => 'lat/lon',
            'map_zoom'      => 5,

            'vector_color'      => '#333333',
            'stroke_color'      => '#444444',
            'select_color'      => '#555555',
            'vector_opacity'    => 6,
            'select_opacity'    => 7,
            'stroke_opacity'    => 8,
            'image_opacity'     => 9,
            'stroke_width'      => 10,
            'point_radius'      => 11,
            'point_image'       => 'file.png',
            'max_zoom'          => 12,
            'min_zoom'          => 13,

        );

        // Update.
        $record->update($values);

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Data fields updated.
        $this->assertEquals($record->slug,          'slug');
        $this->assertEquals($record->title,         'title');
        $this->assertEquals($record->body,          'body');
        $this->assertEquals($record->tags,          'tag1,tag2');
        $this->assertEquals($record->map_active,    4);
        $this->assertEquals($record->map_focus,     'lat/lon');
        $this->assertEquals($record->map_zoom,      5);

        // Tag fields set.
        $this->assertEquals($record->vector_color,      '#333333');
        $this->assertEquals($record->stroke_color,      '#444444');
        $this->assertEquals($record->select_color,      '#555555');
        $this->assertEquals($record->vector_opacity,    6);
        $this->assertEquals($record->select_opacity,    7);
        $this->assertEquals($record->stroke_opacity,    8);
        $this->assertEquals($record->image_opacity,     9);
        $this->assertEquals($record->stroke_width,      10);
        $this->assertEquals($record->point_radius,      11);
        $this->assertEquals($record->point_image,       'file.png');
        $this->assertEquals($record->max_zoom,          12);
        $this->assertEquals($record->min_zoom,          13);

        // Coverage updated.
        $this->assertNotNull($record->coverage);

    }


}
