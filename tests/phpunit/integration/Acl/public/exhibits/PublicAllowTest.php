<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicExhibitsAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->__exhibit('slug');
        $this->logout();
    }


    /**
     * Public users should be able to browse exhibits.
     */
    public function testCanBrowseExhibits()
    {
        $this->dispatch('neatline');
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to show exhibits.
     */
    public function testCanViewExhibits()
    {
        $this->dispatch('neatline/show/slug');
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to GET individual exhibits.
     */
    public function testCanGetExhibits()
    {
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('login');
    }


}
