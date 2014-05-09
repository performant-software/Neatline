<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
     * Contributors should be able to view the fullscreen display for their
     * own private exhibits.
     */
    public function testCanViewFullscreenOwnPrivateExhibits()
    {
        $this->dispatch('neatline/fullscreen/slug2');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to view the fullscreen display for other
     * users' private exhibits.
     */
    public function testCanViewFullscreenOtherUsersPrivateExhibits()
    {
        $this->dispatch('neatline/fullscreen/slug1');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to browse their own private exhibits.
     */
    public function testCanBrowseOwnPrivateExhibits()
    {

        $this->dispatch('neatline');
        $this->assertNotAction('forbidden');

        // Should list own private exhibit.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug2').'"]'
        );

    }


    /**
     * Contributors should be able to browse other users' private exhibits.
     */
    public function testCanBrowseOtherUsersPrivateExhibits()
    {

        $this->dispatch('neatline');
        $this->assertNotAction('forbidden');

        // Should list other user's private exhibit.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug1').'"]'
        );

    }


}
