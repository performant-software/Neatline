<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_currentExhibit()` helper.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest_GetCurrentNeatline
    extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * _nl_currentExhibit() should return the exhibit record currently
     * bound to the view.
     */
    public function testGetCurrentNeatline()
    {

        $exhibit = $this->__exhibit('test-exhibit');
        $this->dispatch('neatline/show/test-exhibit');

        $retrieved = _nl_currentExhibit();
        $this->assertEquals($retrieved->id, $exhibit->id);

    }


}
