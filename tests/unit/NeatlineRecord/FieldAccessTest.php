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
     * --------------------------------------------------------------------
     * Test field set/get.
     * --------------------------------------------------------------------
     */
    public function testFieldAccess()
    {

        // Create a record.
        $record = $this->__record();

        // Data fields:
        $record->item_id            = 1;
        $record->exhibit_id         = 2;
        $record->tag_id             = 3;
        $record->slug               = '4';
        $record->title              = '5';
        $record->body               = '6';
        $record->tags               = '7';
        $record->coverage           = 'POINT(1 1)';
        $record->map_focus          = '8';
        $record->map_zoom           = 9;

        // Styles:
        $record->vector_color       = '10';
        $record->stroke_color       = '11';
        $record->select_color       = '12';
        $record->vector_opacity     = 13;
        $record->select_opacity     = 14;
        $record->stroke_opacity     = 15;
        $record->image_opacity      = 16;
        $record->stroke_width       = 17;
        $record->point_radius       = 18;
        $record->point_image        = '19';
        $record->max_zoom           = 20;
        $record->min_zoom           = 21;
        $record->save();

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Data fields:
        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->exhibit_id,        2);
        $this->assertEquals($record->tag_id,            3);
        $this->assertEquals($record->slug,              '4');
        $this->assertEquals($record->title,             '5');
        $this->assertEquals($record->body,              '6');
        $this->assertEquals($record->tags,              '7');
        $this->assertEquals($record->coverage,          'POINT(1 1)');
        $this->assertEquals($record->map_focus,         '8');
        $this->assertEquals($record->map_zoom,          9);

        // Local styles:
        $this->assertEquals($record->vector_color,      '10');
        $this->assertEquals($record->stroke_color,      '11');
        $this->assertEquals($record->select_color,      '12');
        $this->assertEquals($record->vector_opacity,    13);
        $this->assertEquals($record->select_opacity,    14);
        $this->assertEquals($record->stroke_opacity,    15);
        $this->assertEquals($record->image_opacity,     16);
        $this->assertEquals($record->stroke_width,      17);
        $this->assertEquals($record->point_radius,      18);
        $this->assertEquals($record->point_image,       '19');
        $this->assertEquals($record->max_zoom,          20);
        $this->assertEquals($record->min_zoom,          21);

    }


}
