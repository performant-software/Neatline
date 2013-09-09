<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsPrivateDeny extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->_loginAsContributor('user1');
        $this->exhibit = $this->_exhibit('slug', false);
        $this->_loginAsContributor('user2');
    }


    /**
     * Contributors should not be able to view private exhibits owned by
     * other users.
     */
    public function testCannotViewOtherUsersPrivateExhibits()
    {
      $actions = array(
          'editor',
          'edit',
          'delete',
          'import'
      );

      foreach ($actions as $action) {
          $this->dispatch('neatline/'.$action.'/'.$this->exhibit->id);
          $this->assertController('error');
          $this->assertAction('forbidden');
      }
    }

}
