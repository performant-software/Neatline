<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousItemsAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->item = insert_item();
        $this->_logout();
    }


    /**
     * Anonymous users should be able to GET items.
     */
    public function testCanGetItems()
    {
        $this->dispatch('neatline/items/'.$this->item->id);
        $this->assertNotAction('login');
    }


}
