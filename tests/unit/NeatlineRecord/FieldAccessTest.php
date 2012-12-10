<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set and get.
     */
    public function testFieldAccess()
    {

        // Create a record.
        $record = new NeatlineRecord();

        // Set values:
        $record->item_id            = 1;
        $record->exhibit_id         = 2;
        $record->tag_id             = 3;
        $record->slug               = 'slug';
        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tag1,tag2';
        $record->map_active         = 4;
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 5;

        // Set keys:
        $record->vector_color       = 6;
        $record->stroke_color       = 7;
        $record->select_color       = 8;
        $record->vector_opacity     = 9;
        $record->select_opacity     = 10;
        $record->stroke_opacity     = 11;
        $record->image_opacity      = 12;
        $record->stroke_width       = 13;
        $record->point_radius       = 14;
        $record->point_image        = 'file.png';
        $record->max_zoom           = 15;
        $record->min_zoom           = 16;

        // Save with coverage.
        $record->save('POINT(1 1)');

        // Re-get the record object.
        $record = $this->_recordsTable->find($record->id);

        // Check values:
        $this->assertEquals($record->item_id,       1);
        $this->assertEquals($record->exhibit_id,    2);
        $this->assertEquals($record->tag_id,        3);
        $this->assertEquals($record->slug,          'slug');
        $this->assertEquals($record->title,         'title');
        $this->assertEquals($record->body,          'body');
        $this->assertEquals($record->tags,          'tag1,tag2');
        $this->assertEquals($record->map_active,    4);
        $this->assertEquals($record->map_focus,     'lat/lon');
        $this->assertEquals($record->map_zoom,      5);

        // Check keys:
        $this->assertEquals($record->vector_color,      6);
        $this->assertEquals($record->stroke_color,      7);
        $this->assertEquals($record->select_color,      8);
        $this->assertEquals($record->vector_opacity,    9);
        $this->assertEquals($record->select_opacity,    10);
        $this->assertEquals($record->stroke_opacity,    11);
        $this->assertEquals($record->image_opacity,     12);
        $this->assertEquals($record->stroke_width,      13);
        $this->assertEquals($record->point_radius,      14);
        $this->assertEquals($record->point_image,       'file.png');
        $this->assertEquals($record->max_zoom,          15);
        $this->assertEquals($record->min_zoom,          16);

        // Check the coverage value.
        $this->assertEquals($this->getCoverageAsText($record),
            'POINT(1 1)');

    }


}
