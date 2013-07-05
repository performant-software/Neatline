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
            'base_layers'   => array('1','2'),
            'base_layer'    => '3',
            'widgets'       => array('4','5'),
            'title'         => '6',
            'slug'          => '7',
            'narrative'     => '8',
            'public'        => '9',
            'styles'        => '10',
            'map_focus'     => '11',
            'map_zoom'      => '12'
        ));

        $exhibit = $this->_reload($exhibit);

        $this->assertEquals($exhibit->base_layers,  '1,2');
        $this->assertEquals($exhibit->base_layer,   '3');
        $this->assertEquals($exhibit->widgets,      '4,5');
        $this->assertEquals($exhibit->title,        '6');
        $this->assertEquals($exhibit->slug,         '7');
        $this->assertEquals($exhibit->narrative,    '8');
        $this->assertEquals($exhibit->public,       9);
        $this->assertEquals($exhibit->styles,       10);
        $this->assertEquals($exhibit->map_focus,    11);
        $this->assertEquals($exhibit->map_zoom,     12);

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
        $this->assertEquals($exhibit->published, '2000-01-01');

    }


    /**
     * `saveForm` pass `narrative` through an HTML purifier.
     */
    public function testSanitizeNarrative()
    {

        $exhibit = $this->_exhibit();

        // Set blacklisted HTML.
        $exhibit->saveForm(array(
            'narrative' => 'X<script></script>Y'
        ));

        $exhibit = $this->_reload($exhibit);

        // Should purify the HTML before saving.
        $this->assertEquals($exhibit->narrative, 'XY');

    }


}
