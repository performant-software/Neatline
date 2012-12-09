<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `neatline()` helper.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest_Neatline
    extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * neatline() should return attribute values for the exhibit currently
     * bound to the view.
     */
    public function testNeatlineValue()
    {

        // Create exhibit, hit /show.
        $exhibit = $this->__exhibit('test-exhibit');
        $exhibit->title = 'Test Exhibit';
        $exhibit->description = 'Test description.';
        $exhibit->save();

        // Hit /show.
        $this->dispatch('neatline/show/test-exhibit');

        // Neatline Name
        $this->assertEquals('Test Exhibit', neatline('title'));
        $this->assertEquals('Test Exhibit', neatline('Title'));

        // Neatline Description
        $this->assertEquals('Test description.', neatline('description'));
        $this->assertEquals('Test description.', neatline('Description'));

        // Neatline ID
        $this->assertEquals($exhibit->id, neatline('id'));
        $this->assertEquals($exhibit->id, neatline('ID'));

        $this->assertEquals('test-exhibit', neatline('slug'));
        $this->assertEquals('test-exhibit', neatline('Slug'));

    }


}
