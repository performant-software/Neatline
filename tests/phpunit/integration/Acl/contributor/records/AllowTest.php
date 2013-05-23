<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorRecordsAllow extends Neatline_DefaultCase
{


    protected $_isAdminTest = false;


    public function setUp()
    {

        parent::setUp();

        $this->loginAsResearcher('user1');
        $this->exhibit = $this->__exhibit();

        $this->loginAsResearcher('user2');
        $this->record = $this->__record($this->exhibit);

    }


    /**
     * Contributors should be able to create their own records to their
     * own exhibits.
     */
    public function testCanCreateOwnRecordsInOtherUsersExhibits()
    {
        $this->setPost(array('exhibit_id' => $this->exhibit->id));
        $this->dispatch('neatline/records');
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to update their own records in their
     * own exhibits.
     */
    public function testCanUpdateOwnRecordsInOtherUsersExhibits()
    {
        $this->setPut(array());
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to delete their own records in their
     * own exhibits.
     */
    public function testCanDeleteOwnRecordsInOtherUsersExhibits()
    {
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotAction('forbidden');
    }


}
