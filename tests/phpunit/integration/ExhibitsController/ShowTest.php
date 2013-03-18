<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for show action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Show extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * The show action should load exhibits by slug.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->__exhibit('slug');
        $this->dispatch('neatline/show/slug');
        $this->assertEquals(_nl_exhibit()->id, $exhibit->id);
    }


}
