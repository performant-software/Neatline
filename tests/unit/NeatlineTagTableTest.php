<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tag table tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest extends Neatline_Test_AppTestCase
{


    /**
     * createExhibitDefault() should create a default tag for an exhibit
     * populated with system-default values from the plugin.ini file.
     *
     * @group tags
     */
    public function testCreateExhibitDefault()
    {

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create default tag.
        $tag = $this->_tagsTable->createExhibitDefault($exhibit);

        // Check attributes.
        $this->assertEquals($tag->is_default, 1);
        $this->assertEquals($tag->exhibit_id, $exhibit->id);
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
