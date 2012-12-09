<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `total_neatlines()` helper.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest_TotalNeatlines
    extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * total_neatlines() should return the total number of exhibits.
     */
    public function testTotalNeatlines()
    {

        $this->dispatch('neatline');
        $this->assertEquals(0, total_neatlines());

        $neatlineOne = $this->__exhibit();
        $this->assertEquals(1, total_neatlines());

        $neatlineTwo = $this->__exhibit();
        $this->assertEquals(2, total_neatlines());

        $neatlineTwo->delete();
        $this->assertEquals(1, total_neatlines());

    }


}
