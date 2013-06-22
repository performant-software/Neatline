<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousExhibitsPublicDeny extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->_exhibit('slug');
        $this->_logout();
    }


    /**
     * Anonymous users should not be able to PUT exhibits.
     */
    public function testCannotUpdateExhibits()
    {
        $this->_setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertAction('login');
    }


}
