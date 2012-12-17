<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `has_neatlines_for_loop()` helper.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest_HasNeatlinesForLoop
    extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * --------------------------------------------------------------------
     * has_neatlines_for_loop() should return false when no exhibits.
     * --------------------------------------------------------------------
     */
    public function testHasNoNeatlinesForLoop()
    {
        $this->dispatch('neatline');
        $this->assertFalse(has_neatlines_for_loop());
    }


    /**
     * --------------------------------------------------------------------
     * has_neatlines_for_loop() should return true when >= 1 exhibit.
     * --------------------------------------------------------------------
     */
    public function testHasNeatlinesForLoop()
    {
        $this->__exhibit();
        $this->dispatch('neatline');
        $this->assertTrue(has_neatlines_for_loop());
    }


}
