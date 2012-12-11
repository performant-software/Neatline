<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `setFields()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_SetStaticFields
    extends Neatline_Test_AppTestCase
{


    /**
     * setFields() should update all non-style, non-foreign-key fields.
     *
     * @group tags
     */
    public function testSetFields()
    {

        // Create a record.
        $record = $this->__record();

        // Null all attributes.
        $record->item_id        = null;
        $record->exhibit_id     = null;
        $record->tag_id         = null;
        $record->slug           = null;
        $record->title          = null;
        $record->body           = null;
        $record->tags           = null;
        $record->map_active     = null;
        $record->map_focus      = null;
        $record->map_zoom       = null;
        $record->vector_color   = null;
        $record->stroke_color   = null;
        $record->select_color   = null;
        $record->vector_opacity = null;
        $record->select_opacity = null;
        $record->stroke_opacity = null;
        $record->image_opacity  = null;
        $record->stroke_width   = null;
        $record->point_radius   = null;
        $record->point_image    = null;
        $record->max_zoom       = null;
        $record->min_zoom       = null;

        // Mock values:
        $values = array(

            // Foreign key fields:
            // -------------------

            'item_id'       => 1,
            'exhibit_id'    => 2,
            'tag_id'        => 3,

            // Local values:
            // -------------

            'slug'          => '4',
            'title'         => '5',
            'body'          => '6',
            'tags'          => '7',
            'map_active'    => 8,
            'map_focus'     => '9',
            'map_zoom'      => 10,

            // Locally-set styles:
            // -------------------

            'vector_color'      => '11',
            'stroke_color'      => '12',
            'select_color'      => '13',
            'vector_opacity'    => 14,
            'select_opacity'    => 15,
            'stroke_opacity'    => 16,
            'image_opacity'     => 17,
            'stroke_width'      => 18,
            'point_radius'      => 19,
            'point_image'       => '20',
            'max_zoom'          => 21,
            'min_zoom'          => 22

        );

        // Set static fields.
        $record->setFields($values);

        // Static fields updated.
        $this->assertEquals($record->slug,          '4');
        $this->assertEquals($record->title,         '5');
        $this->assertEquals($record->body,          '6');
        $this->assertEquals($record->tags,          '7');
        $this->assertEquals($record->map_active,    8);
        $this->assertEquals($record->map_focus,     '9');
        $this->assertEquals($record->map_zoom,      10);

        // Foreign keys unchanged.
        $this->assertNull($record->item_id);
        $this->assertNull($record->exhibit_id);
        $this->assertNull($record->tag_id);

        // Style fields unchanged.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->select_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->select_opacity);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->image_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);
        $this->assertNull($record->point_image);
        $this->assertNull($record->max_zoom);
        $this->assertNull($record->min_zoom);


    }


}
