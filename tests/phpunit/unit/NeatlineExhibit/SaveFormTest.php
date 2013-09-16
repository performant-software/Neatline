<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_SaveForm extends Neatline_Case_Default
{


    /**
     * `saveForm` should save all key => value pairs in the form data.
     */
    public function testSaveForm()
    {

        $exhibit = $this->_exhibit();

        $exhibit->saveForm(array(
            'spatial_layers'    => array('1','2'),
            'spatial_layer'     => '3',
            'widgets'           => array('4','5'),
            'title'             => '6',
            'slug'              => '7',
            'narrative'         => '8',
            'public'            => '9',
            'styles'            => '10',
            'map_focus'         => '11',
            'map_zoom'          => '12'
        ));

        $exhibit = $this->_reload($exhibit);

        $this->assertEquals('1,2',  $exhibit->spatial_layers);
        $this->assertEquals('3',    $exhibit->spatial_layer);
        $this->assertEquals('4,5',  $exhibit->widgets);
        $this->assertEquals('6',    $exhibit->title);
        $this->assertEquals('7',    $exhibit->slug);
        $this->assertEquals('8',    $exhibit->narrative);
        $this->assertEquals(9,      $exhibit->public);
        $this->assertEquals(10,     $exhibit->styles);
        $this->assertEquals(11,     $exhibit->map_focus);
        $this->assertEquals(12,     $exhibit->map_zoom);

    }


    /**
     * `saveForm` should cast empty/whitespace strings to NULL.
     */
    public function testCastWhitespaceToNull()
    {

        $exhibit = $this->_exhibit();

        // String field.
        $exhibit->saveForm(array('title' => ''));
        $this->assertNull($exhibit->title);
        $exhibit->saveForm(array('title' => ' '));
        $this->assertNull($exhibit->title);

        // Number field.
        $exhibit->saveForm(array('map_zoom' => ''));
        $this->assertNull($exhibit->map_zoom);
        $exhibit->saveForm(array('map_zoom' => ' '));
        $this->assertNull($exhibit->map_zoom);

    }


    /**
     * `saveForm` set the `published` timestamp when the exhibit is marked
     * as "Public" for the first time.
     */
    public function testSetPublishedTimestamp()
    {

        $exhibit = $this->_exhibit();

        // Should set when `public` is flipped on for the first time.
        $exhibit->saveForm(array('public' => 1));
        $this->assertNotNull($exhibit->published);

        // Should not update when the exhibit is re-saved as "Public".
        $exhibit->published = '2000-01-01';
        $exhibit->saveForm(array('public' => 1));
        $this->assertEquals('2000-01-01', $exhibit->published);

    }


}
