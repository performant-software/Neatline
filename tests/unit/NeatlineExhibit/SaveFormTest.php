<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm()` on NeatlineExhibit.
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
     * saveForm() should save all key => value pairs in the form data.
     */
    public function testSaveForm()
    {

        $exhibit = $this->__exhibit();

        $exhibit->saveForm(array(
            'title'         => 'title',
            'slug'          => 'slug',
            'description'   => 'desc',
            'base_layers'   => array('layer1', 'layer2'),
            'base_layer'    => 'layer1',
            'public'        => 1
        ));

        // Should set values.
        $this->assertEquals($exhibit->title,        'title');
        $this->assertEquals($exhibit->slug,         'slug');
        $this->assertEquals($exhibit->description,  'desc');
        $this->assertEquals($exhibit->base_layers,  'layer1,layer2');
        $this->assertEquals($exhibit->base_layer,   'layer1');
        $this->assertEquals($exhibit->public,       1);

    }


}
