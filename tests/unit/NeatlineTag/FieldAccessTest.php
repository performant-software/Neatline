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
        $tag->tag                = '1';
        $tag->vector_color       = '2';
        $tag->stroke_color       = '3';
        $tag->select_color       = '4';
        $tag->vector_opacity     = 5;
        $tag->select_opacity     = 6;
        $tag->stroke_opacity     = 7;
        $tag->image_opacity      = 8;
        $tag->stroke_width       = 9;
        $tag->point_radius       = 10;
        $tag->point_image        = '11';
        $tag->max_zoom           = 12;
        $tag->min_zoom           = 13;
        $tag->save();

        // Re-get the record.
        $tag = $this->_tagsTable->find($tag->id);

        // Check values:
        $this->assertEquals($tag->tag,              '1');
        $this->assertEquals($tag->vector_color,     '2');
        $this->assertEquals($tag->stroke_color,     '3');
        $this->assertEquals($tag->select_color,     '4');
        $this->assertEquals($tag->vector_opacity,   5);
        $this->assertEquals($tag->select_opacity,   6);
        $this->assertEquals($tag->stroke_opacity,   7);
        $this->assertEquals($tag->image_opacity,    8);
        $this->assertEquals($tag->stroke_width,     9);
        $this->assertEquals($tag->point_radius,     10);
        $this->assertEquals($tag->point_image,      '11');
        $this->assertEquals($tag->max_zoom,         12);
        $this->assertEquals($tag->min_zoom,         13);

    }


}
