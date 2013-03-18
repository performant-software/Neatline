<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_SaveForm extends Neatline_TestCase
{


    /**
     * `saveForm` should save all key => value pairs in the form data.
     */
    public function testSaveForm()
    {

        $exhibit = $this->__exhibit();

        $exhibit->saveForm(array(
            'base_layers'   => array('1','2'),
            'base_layer'    => '3',
            'widgets'       => array('4','5'),
            'title'         => '6',
            'slug'          => '7',
            'description'   => '8',
            'public'        => '9',
            'styles'        => '10',
            'map_focus'     => '11',
            'map_zoom'      => '12'
        ));

        $exhibit = $this->__exhibits->find($exhibit->id);

        $this->assertEquals($exhibit->base_layers,  '1,2');
        $this->assertEquals($exhibit->base_layer,   '3');
        $this->assertEquals($exhibit->widgets,      '4,5');
        $this->assertEquals($exhibit->title,        '6');
        $this->assertEquals($exhibit->slug,         '7');
        $this->assertEquals($exhibit->description,  '8');
        $this->assertEquals($exhibit->public,       9);
        $this->assertEquals($exhibit->styles,       10);
        $this->assertEquals($exhibit->map_focus,    11);
        $this->assertEquals($exhibit->map_zoom,     12);

    }


    /**
     * `saveForm` should set empty/whitespace strings as `null`.
     */
    public function testWhitespaceBlocking()
    {

        $exhibit = $this->__exhibit();

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


}
