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
     * saveForm() should save all key=>value pairs in the form data.
     */
    public function testSaveForm()
    {

        // Create an exhibit and map.
        $exhibit = $this->__exhibit();

        // Save form data.
        $exhibit->saveForm(array(
            'title'         => 'Form Title',
            'description'   => 'Form description.',
            'slug'          => 'form-slug',
            'public'        => 1
        ));

        // Check values.
        $this->assertEquals($exhibit->title, 'Form Title');
        $this->assertEquals($exhibit->description, 'Form description.');
        $this->assertEquals($exhibit->slug, 'form-slug');
        $this->assertEquals($exhibit->public, 1);

    }


}
