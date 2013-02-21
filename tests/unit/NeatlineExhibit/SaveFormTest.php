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

class Neatline_NeatlineExhibitTest_SaveForm
    extends Neatline_Test_AppTestCase
{


    /**
     * `saveForm` should save all key => value pairs in the form data.
     */
    public function testSaveForm()
    {

        $exhibit = $this->__exhibit();

        $exhibit->saveForm(array(
            'base_layers'   => '1',
            'base_layer'    => '2',
            'title'         => '3',
            'slug'          => '4',
            'description'   => '5',
            'public'        => '6',
            'styles'        => '7',
            'map_focus'     => '8',
            'map_zoom'      => '9'
        ));

        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        $this->assertEquals($exhibit->base_layers,  '1');
        $this->assertEquals($exhibit->base_layer,   '2');
        $this->assertEquals($exhibit->title,        '3');
        $this->assertEquals($exhibit->slug,         '4');
        $this->assertEquals($exhibit->description,  '5');
        $this->assertEquals($exhibit->public,       6);
        $this->assertEquals($exhibit->styles,       7);
        $this->assertEquals($exhibit->map_focus,    8);
        $this->assertEquals($exhibit->map_zoom,     9);

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
