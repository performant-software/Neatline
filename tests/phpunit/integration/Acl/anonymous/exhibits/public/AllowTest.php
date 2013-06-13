<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousExhibitsPublicAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->__exhibit('slug');
        $this->logout();
    }


    /**
     * Anonymous users should be able to view public exhibits.
     */
    public function testCanViewExhibits()
    {
        $this->dispatch('neatline/show/slug');
        $this->assertNotAction('login');
    }


    /**
     * Anonymous users should be able to GET individual public exhibits.
     */
    public function testCanGetExhibits()
    {
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('login');
    }


    /**
     * Anonymous users should be able to browse public exhibits.
     */
    public function testCanBrowseExhibits()
    {

        $this->dispatch('neatline');
        $this->assertNotAction('login');

        // Should list public exhibit.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug').'"]'
        );

    }


}
