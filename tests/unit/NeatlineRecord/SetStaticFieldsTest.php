<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `setStaticFields()` on NeatlineRecord.
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
     * setStaticFields() set all static fields when there are keys for all
     * valid fields in the input array.
     *
     * @group tags
     */
    public function testWithAllFieldsPresent()
    {

        // Create a record.
        $record = $this->__record();

        // Input values.
        $values = array(
            'item_id'       => 1,
            'exhibit_id'    => 2,
            'tag_id'        => 3,
            'slug'          => 'slug',
            'title'         => 'title',
            'body'          => 'body',
            'tags'          => 'tag1,tag2',
            'map_active'    => 4,
            'map_focus'     => 'lat/lon',
            'map_zoom'      => 5,
        );

        // Set, check for updates.
        $record->setStaticFields($values);
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


    }


    /**
     * When setStaticFields() is passed an array of values that does not
     * have a key for all of the valid non-style fields, just the fields
     * with keys should be set and the others should not be changed.
     *
     * @group tags
     */
    public function testWithNotAllFieldsPresent()
    {

        // Create a record.
        $record = $this->__record();

        // Set all fields null.
        $record->item_id    = null;
        $record->exhibit_id = null;
        $record->tag_id     = null;
        $record->slug       = null;
        $record->title      = null;
        $record->body       = null;
        $record->tags       = null;
        $record->map_active = null;
        $record->map_focus  = null;
        $record->map_zoom   = null;

        // Input values.
        $values = array(
            'item_id'       => 1,
            'tag_id'        => 2,
            'title'         => 'title',
            'tags'          => 'tag1,tag2',
            'map_focus'     => 'lat/lon'
        );

        // Set static fields.
        $record->setStaticFields($values);

        // Fields with keys updated.
        $this->assertEquals($record->item_id,   1);
        $this->assertEquals($record->tag_id,    2);
        $this->assertEquals($record->title,     'title');
        $this->assertEquals($record->tags,      'tag1,tag2');
        $this->assertEquals($record->map_focus, 'lat/lon');

        // Fields without keys unchanged.
        $this->assertNull($record->exhibit_id);
        $this->assertNull($record->slug);
        $this->assertNull($record->body);
        $this->assertNull($record->map_active);
        $this->assertNull($record->map_zoom);


    }


    /**
     * If tag-backed style fields are included in the values array passed
     * to setStaticFields(), the style fields should be ignored.
     *
     * @group tags
     */
    public function testWithStyleFieldsPresent()
    {

        // Create a record.
        $record = $this->__record();

        // Set all styles to 0.
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

            // Local values:
            // -------------

            'item_id'       => 1,
            'exhibit_id'    => 2,
            'tag_id'        => 3,
            'slug'          => 'slug',
            'title'         => 'title',
            'body'          => 'body',
            'tags'          => 'tag1,tag2',
            'map_active'    => 4,
            'map_focus'     => 'lat/lon',
            'map_zoom'      => 5,

            // Locally-set styles:
            // -------------------

            'vector_color'          => '#333333',
            'stroke_color'          => '#444444',
            'select_color'          => '#555555',
            'vector_opacity'        => 6,
            'select_opacity'        => 7,
            'stroke_opacity'        => 8,
            'image_opacity'         => 9,
            'stroke_width'          => 10,
            'point_radius'          => 11,
            'point_image'           => 'file.png',
            'max_zoom'              => 12,
            'min_zoom'              => 13,

        );

        // Set static fields.
        $record->setStaticFields($values);

        // Static fields updated.
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
