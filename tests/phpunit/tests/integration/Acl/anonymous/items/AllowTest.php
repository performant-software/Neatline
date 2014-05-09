<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousItemsAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->item = insert_item(array('public' => true));
        $this->_logout();
    }


    /**
     * Anonymous users should be able to GET public items.
     */
    public function testCanGetPublicItems()
    {
        $this->dispatch('neatline/items/'.$this->item->id);
        $this->assertNotAction('login');
    }


}
