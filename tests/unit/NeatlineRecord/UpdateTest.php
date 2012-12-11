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
        $record = $this->__record(null, $exhibit);

        // Create tag1.
        $tag1 = new NeatlineTag($exhibit);
        $tag1->max_zoom = 15;
        $tag1->tag = 'tag1';
        $tag1->save();

        // Create tag2.
        $tag2 = new NeatlineTag($exhibit);
        $tag2->min_zoom = 10;
        $tag2->tag = 'tag2';
        $tag2->save();

        // Mock values:
        $values = array(

            // Local values:
            // -------------

            'slug'          => 'slug',
            'title'         => 'title',
            'body'          => 'body',
            'tags'          => 'tag1,tag2',
            'coverage'      => 'POINT(1 1)',
            'map_active'    => 4,
            'map_focus'     => 'lat/lon',
            'map_zoom'      => 5,

            // Locally-set styles:
            // -------------------

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
            'max_zoom'          => null,
            'min_zoom'          => null,

        );

        // Update.
        $c1 = $this->_tagsTable->count();
        $record->update($values);
        $c2 = $this->_tagsTable->count();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Static fields updated.
        $this->assertEquals($record->slug,          'slug');
        $this->assertEquals($record->title,         'title');
        $this->assertEquals($record->body,          'body');
        $this->assertEquals($record->tags,          'tag1,tag2');
        $this->assertEquals($record->map_active,    4);
        $this->assertEquals($record->map_focus,     'lat/lon');
        $this->assertEquals($record->map_zoom,      5);
        $this->assertNotNull($record->coverage);

        // Record tag created.
        $this->assertEquals($c1+1, $c2);

        // Tag fields set.
        $tag = $this->getLastTag();
        $this->assertEquals($record->tag_id,        $tag->id);
        $this->assertEquals($tag->vector_color,     '#333333');
        $this->assertEquals($tag->stroke_color,     '#444444');
        $this->assertEquals($tag->select_color,     '#555555');
        $this->assertEquals($tag->vector_opacity,   6);
        $this->assertEquals($tag->select_opacity,   7);
        $this->assertEquals($tag->stroke_opacity,   8);
        $this->assertEquals($tag->image_opacity,    9);
        $this->assertEquals($tag->stroke_width,     10);
        $this->assertEquals($tag->point_radius,     11);
        $this->assertEquals($tag->point_image,      'file.png');
        $this->assertNull($tag->max_zoom);
        $this->assertNull($tag->min_zoom);

        // Tag keys updated.
        $this->assertEquals($record->max_zoom, $tag1->id);
        $this->assertEquals($record->min_zoom, $tag2->id);

    }


}
