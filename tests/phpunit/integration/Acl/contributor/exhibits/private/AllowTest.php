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
        $this->_loginAsContributor();
        $this->exhibit = $this->_exhibit('slug', false);
    }


    /**
     * Contributors should be able to view their own private exhibits.
     */
    public function testCanViewOwnPrivateExhibits()
    {
        $this->dispatch('neatline/show/slug');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to browse their own private exhibits.
     */
    public function testCanBrowseOwnPrivateExhibits()
    {

        $this->dispatch('neatline');
        $this->assertNotAction('forbidden');

        // Should list private exhibit.
        $this->assertXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug').'"]'
        );

    }


}
