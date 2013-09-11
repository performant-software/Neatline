<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsPrivateAllow
    extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->_loginAsContributor('user1');
        $this->_exhibit('slug1', false);
        $this->_loginAsContributor('user2');
        $this->_exhibit('slug2', false);
    }


    /**
     * Contributors should be able to view their own private exhibits.
     */
    public function testCanViewOwnPrivateExhibits()
    {
        $this->dispatch('neatline/show/slug2');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to view other users' private exhibits.
     */
    public function testCanViewOtherUsersPrivateExhibits()
    {
        $this->dispatch('neatline/show/slug1');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to browse private exhibits.
     */
    public function testCanBrowsePrivateExhibits()
    {

        $this->dispatch('neatline');
        $this->assertNotAction('forbidden');

        // Should list private exhibits.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug1').'"]'
        );
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug2').'"]'
        );

    }


}
