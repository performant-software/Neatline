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
        $record->map_active         = 8;
        $record->map_focus          = '9';
        $record->map_zoom           = 10;

        // Local styles:
        $record->vector_color       = '11';
        $record->stroke_color       = '12';
        $record->select_color       = '13';
        $record->vector_opacity     = 14;
        $record->select_opacity     = 15;
        $record->stroke_opacity     = 16;
        $record->image_opacity      = 17;
        $record->stroke_width       = 18;
        $record->point_radius       = 19;
        $record->point_image        = '20';
        $record->max_zoom           = 21;
        $record->min_zoom           = 22;

        // Tag references:
        $record->_vector_color      = 23;
        $record->_stroke_color      = 24;
        $record->_select_color      = 25;
        $record->_vector_opacity    = 26;
        $record->_select_opacity    = 27;
        $record->_stroke_opacity    = 28;
        $record->_image_opacity     = 29;
        $record->_stroke_width      = 30;
        $record->_point_radius      = 31;
        $record->_point_image       = 32;
        $record->_max_zoom          = 33;
        $record->_min_zoom          = 34;
        $record->save();

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Data fields:
        $this->assertEquals($record->item_id,       1);
        $this->assertEquals($record->exhibit_id,    2);
        $this->assertEquals($record->tag_id,        3);
        $this->assertEquals($record->slug,          '4');
        $this->assertEquals($record->title,         '5');
        $this->assertEquals($record->body,          '6');
        $this->assertEquals($record->tags,          '7');
        $this->assertEquals($record->map_active,    8);
        $this->assertEquals($record->map_focus,     '9');
        $this->assertEquals($record->map_zoom,      10);

        // Local styles:
        $this->assertEquals($record->vector_color,      '11');
        $this->assertEquals($record->stroke_color,      '12');
        $this->assertEquals($record->select_color,      '13');
        $this->assertEquals($record->vector_opacity,    14);
        $this->assertEquals($record->select_opacity,    15);
        $this->assertEquals($record->stroke_opacity,    16);
        $this->assertEquals($record->image_opacity,     17);
        $this->assertEquals($record->stroke_width,      18);
        $this->assertEquals($record->point_radius,      19);
        $this->assertEquals($record->point_image,       '20');
        $this->assertEquals($record->max_zoom,          21);
        $this->assertEquals($record->min_zoom,          22);

        // Tag references:
        $this->assertEquals($record->_vector_color,      23);
        $this->assertEquals($record->_stroke_color,      24);
        $this->assertEquals($record->_select_color,      25);
        $this->assertEquals($record->_vector_opacity,    26);
        $this->assertEquals($record->_select_opacity,    27);
        $this->assertEquals($record->_stroke_opacity,    28);
        $this->assertEquals($record->_image_opacity,     29);
        $this->assertEquals($record->_stroke_width,      30);
        $this->assertEquals($record->_point_radius,      31);
        $this->assertEquals($record->_point_image,       32);
        $this->assertEquals($record->_max_zoom,          33);
        $this->assertEquals($record->_min_zoom,          34);

        // Check the coverage value.
        $this->assertEquals($this->getCoverageAsText($record),
            'POINT(1 1)'
        );

    }


}
