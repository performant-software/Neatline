<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousExhibitsPrivateDeny extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->_exhibit('slug', false);
        $this->_logout();
    }


    /**
     * Anonymous users should not be able to view private exhibits.
     */
    public function testCannotViewPrivateExhibits()
    {
        $this->_expect404();
        $this->dispatch('neatline/show/slug');
    }


    /**
     * Anonymous users should not be able to view the fullscreen display for
     * private exhibits.
     */
    public function testCannotViewFullscreenPrivateExhibits()
    {
        $this->_expect404();
        $this->dispatch('neatline/fullscreen/slug');
    }


    /**
     * Anonymous users should not be able to browse private exhibits.
     */
    public function testCannotBrowsePrivateExhibits()
    {

        $this->dispatch('neatline');

        // Should not list private exhibit.
        $this->assertNotXpath('//a[@class="neatline"][@href="'.
            public_url('neatline/show/slug').'"]'
        );

    }


}
