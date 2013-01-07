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
     * --------------------------------------------------------------------
     * Test field set/get.
     * --------------------------------------------------------------------
     */
    public function testFieldAccess()
    {

        // Create a tag.
        $exhibit = $this->__exhibit();
        $tag = new NeatlineTag($exhibit);

        // Set:
        $tag->tag                = 'tag';
        $tag->vector_color       = 1;
        $tag->stroke_color       = 1;
        $tag->select_color       = 1;
        $tag->vector_opacity     = 1;
        $tag->select_opacity     = 1;
        $tag->stroke_opacity     = 1;
        $tag->image_opacity      = 1;
        $tag->stroke_width       = 1;
        $tag->point_radius       = 1;
        $tag->point_image        = 1;
        $tag->max_zoom           = 1;
        $tag->min_zoom           = 1;
        $tag->save();

        // Re-get the record.
        $tag = $this->_tagsTable->find($tag->id);

        // Check values:
        $this->assertEquals($tag->tag,              'tag');
        $this->assertEquals($tag->vector_color,     1);
        $this->assertEquals($tag->stroke_color,     1);
        $this->assertEquals($tag->select_color,     1);
        $this->assertEquals($tag->vector_opacity,   1);
        $this->assertEquals($tag->select_opacity,   1);
        $this->assertEquals($tag->stroke_opacity,   1);
        $this->assertEquals($tag->image_opacity,    1);
        $this->assertEquals($tag->stroke_width,     1);
        $this->assertEquals($tag->point_radius,     1);
        $this->assertEquals($tag->point_image,      1);
        $this->assertEquals($tag->max_zoom,         1);
        $this->assertEquals($tag->min_zoom,         1);

    }


}
