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
        $item = $this->__item();
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord($item, $neatline);

        // Set.
        $record->slug               = 'slug';
        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tag1,tag2';
        $record->vector_color       = '#ffffff';
        $record->stroke_color       = '#ffffff';
        $record->select_color       = '#ffffff';
        $record->vector_opacity     = 50;
        $record->select_opacity     = 50;
        $record->stroke_opacity     = 50;
        $record->image_opacity      = 50;
        $record->stroke_width       = 3;
        $record->point_radius       = 3;
        $record->point_image        = 'http://test.org';
        $record->map_active         = 1;
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 5;
        $record->save('POINT(1 1)');

        // Re-get the record object.
        $record = $this->_recordsTable->find($record->id);

        // Check values.
        $this->assertEquals($record->slug, 'slug');
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->body, 'body');
        $this->assertEquals($record->tags, 'tag1,tag2');
        $this->assertEquals($record->vector_color, '#ffffff');
        $this->assertEquals($record->stroke_color, '#ffffff');
        $this->assertEquals($record->select_color, '#ffffff');
        $this->assertEquals($record->vector_opacity, 50);
        $this->assertEquals($record->select_opacity, 50);
        $this->assertEquals($record->stroke_opacity, 50);
        $this->assertEquals($record->image_opacity, 50);
        $this->assertEquals($record->stroke_width, 3);
        $this->assertEquals($record->point_radius, 3);
        $this->assertEquals($record->point_image, 'http://test.org');
        $this->assertEquals($record->map_active, 1);
        $this->assertEquals($record->map_focus, 'lat/lon');
        $this->assertEquals($record->map_zoom, 5);

        // Check the coverage value.
        $this->assertEquals($this->getCoverageAsText($record),
            'POINT(1 1)');

    }


}
