<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorRecordsDeny extends Neatline_DefaultCase
{


    protected $_isAdminTest = false;


    public function setUp()
    {

        parent::setUp();

        $this->loginAsResearcher('user1');
        $this->exhibit  = $this->__exhibit();
        $this->record   = $this->__record($this->exhibit);

        $this->loginAsResearcher('user2');

    }


    /**
     * Contributors should NOT be able to update other users' records in
     * other users' exhibits.
     */
    public function testCanUpdateOtherUsersRecordsInOtherUsersExhibits()
    {
        $this->setPut(array());
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('forbidden');
    }


    /**
     * Contributors should NOT be able to delete other users' records in
     * other users' exhibits.
     */
    public function testCanDeleteOtherUsersRecordsInOtherUsersExhibits()
    {
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('forbidden');
    }


}
