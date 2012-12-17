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
     * --------------------------------------------------------------------
     * neatline() should return exhibit field values.
     * --------------------------------------------------------------------
     */
    public function testNeatlineValue()
    {

        // Create exhibit, set fields.
        $exhibit = $this->__exhibit('test-exhibit');
        $exhibit->title         = 'title';
        $exhibit->description   = 'desc';
        $exhibit->save();

        // Hit /show.
        $this->dispatch('neatline/show/test-exhibit');

        // Get fields
        $this->assertEquals('title', neatline('title'));
        $this->assertEquals('desc', neatline('description'));
        $this->assertEquals($exhibit->id, neatline('id'));

    }


}
