<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `createExhibitTag()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_CreateExhibitTag
    extends Neatline_Test_AppTestCase
{


    /**
     * createExhibitTag() should create a default tag for an exhibit and
     * populate it with default values from the plugin.ini file.
     *
     * @group tags
     */
    public function testCreateExhibitTag()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'test';
        $exhibit->parentSave();

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Create default tag.
        $tag = $this->_tagsTable->createExhibitTag();
        $this->assertEquals($startCount+1, $this->_tagsTable->count());

        // NULL tag name:
        $this->assertNull($tag->tag);

        // Vector color:
        $this->assertEquals($tag->vector_color, get_plugin_ini(
            'Neatline', 'vector_color'));

        // Stroke color:
        $this->assertEquals($tag->stroke_color, get_plugin_ini(
            'Neatline', 'stroke_color'));

        // Select color:
        $this->assertEquals($tag->select_color, get_plugin_ini(
            'Neatline', 'select_color'));

        // Vector opacity:
        $this->assertEquals($tag->vector_opacity, get_plugin_ini(
            'Neatline', 'vector_opacity'));

        // Select opacity:
        $this->assertEquals($tag->select_opacity, get_plugin_ini(
            'Neatline', 'select_opacity'));

        // Stroke opacity:
        $this->assertEquals($tag->stroke_opacity, get_plugin_ini(
            'Neatline', 'stroke_opacity'));

        // Image opacity:
        $this->assertEquals($tag->image_opacity, get_plugin_ini(
            'Neatline', 'image_opacity'));

        // Stroke width:
        $this->assertEquals($tag->stroke_width, get_plugin_ini(
            'Neatline', 'stroke_width'));

        // Point radius:
        $this->assertEquals($tag->point_radius, get_plugin_ini(
            'Neatline', 'point_radius'));

        // Null defaults for image, zooms.
        $this->assertNull($tag->point_image);
        $this->assertNull($tag->max_zoom);
        $this->assertNull($tag->min_zoom);

    }


}
