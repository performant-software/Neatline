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
     * Test field set/get.
     */
    public function testFieldAccess()
    {

        $record = $this->__record();

        // Set fields.
        $record->item_id            = 1;
        $record->exhibit_id         = 2;
        $record->title              = '3';
        $record->_title             = '4';
        $record->body               = '5';
        $record->_body              = '6';
        $record->coverage           = 'POINT(7 7)';
        $record->slug               = '8';
        $record->tags               = '9';
        $record->map_focus          = '10';
        $record->map_zoom           = 11;
        $record->vector_color       = '12';
        $record->stroke_color       = '13';
        $record->select_color       = '14';
        $record->vector_opacity     = 15;
        $record->select_opacity     = 16;
        $record->stroke_opacity     = 17;
        $record->image_opacity      = 18;
        $record->stroke_width       = 19;
        $record->point_radius       = 20;
        $record->point_image        = '21';
        $record->max_zoom           = 22;
        $record->min_zoom           = 23;
        $record->__save();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Fields should be set.
        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->exhibit_id,        2);
        $this->assertEquals($record->title,             '3');
        $this->assertEquals($record->_title,            '4');
        $this->assertEquals($record->body,              '5');
        $this->assertEquals($record->_body,             '6');
        $this->assertEquals($record->coverage,          'POINT(7 7)');
        $this->assertEquals($record->slug,              '8');
        $this->assertEquals($record->tags,              '9');
        $this->assertEquals($record->map_focus,         '10');
        $this->assertEquals($record->map_zoom,          11);
        $this->assertEquals($record->vector_color,      '12');
        $this->assertEquals($record->stroke_color,      '13');
        $this->assertEquals($record->select_color,      '14');
        $this->assertEquals($record->vector_opacity,    15);
        $this->assertEquals($record->select_opacity,    16);
        $this->assertEquals($record->stroke_opacity,    17);
        $this->assertEquals($record->image_opacity,     18);
        $this->assertEquals($record->stroke_width,      19);
        $this->assertEquals($record->point_radius,      20);
        $this->assertEquals($record->point_image,       '21');
        $this->assertEquals($record->max_zoom,          22);
        $this->assertEquals($record->min_zoom,          23);

    }


}
