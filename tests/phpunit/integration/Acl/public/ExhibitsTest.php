<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicExhibit extends Neatline_DefaultCase
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->__exhibit('slug');
        $this->logout();
    }


    /**
     * Public users should be able to `browse` exhibits.
     */
    public function testAllowBrowse()
    {
        $this->dispatch('neatline');
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to `show` exhibits.
     */
    public function testAllowShow()
    {
        $this->dispatch('neatline/show/slug');
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to `get` exhibits.
     */
    public function testAllowGet()
    {
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('login');
    }


    /**
     * Public users should NOT be able to `put` exhibits.
     */
    public function testBlockPut()
    {
        $this->writePut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertAction('login');
    }


}
