<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineTag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set and get.
     */
    public function testFieldAccess()
    {

        // Create a tag.
        $exhibit = $this->__exhibit();
        $tag = new NeatlineTag($exhibit);

        // Set:
        $tag->tag                = 'tag';
        $tag->vector_color       = '#111111';
        $tag->stroke_color       = '#222222';
        $tag->select_color       = '#333333';
        $tag->vector_opacity     = 4;
        $tag->select_opacity     = 5;
        $tag->stroke_opacity     = 6;
        $tag->image_opacity      = 7;
        $tag->stroke_width       = 8;
        $tag->point_radius       = 9;
        $tag->point_image        = 'file.png';
        $tag->max_zoom           = 10;
        $tag->min_zoom           = 11;
        $tag->save();

        // Re-get the record.
        $tag = $this->_tagsTable->find($tag->id);

        // Check values:
        $this->assertEquals($tag->tag,              'tag');
        $this->assertEquals($tag->vector_color,     '#111111');
        $this->assertEquals($tag->stroke_color,     '#222222');
        $this->assertEquals($tag->select_color,     '#333333');
        $this->assertEquals($tag->vector_opacity,   4);
        $this->assertEquals($tag->select_opacity,   5);
        $this->assertEquals($tag->stroke_opacity,   6);
        $this->assertEquals($tag->image_opacity,    7);
        $this->assertEquals($tag->stroke_width,     8);
        $this->assertEquals($tag->point_radius,     9);
        $this->assertEquals($tag->point_image,      'file.png');
        $this->assertEquals($tag->max_zoom,         10);
        $this->assertEquals($tag->min_zoom,         11);

    }


}
