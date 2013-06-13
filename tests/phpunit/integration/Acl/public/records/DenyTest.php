<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicRecordsDeny extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit  = $this->__exhibit();
        $this->record   = $this->__record($this->exhibit);
        $this->logout();
    }


    /**
     * Public users should not be able to POST new records.
     */
    public function testCannotCreateRecords()
    {
        $this->request->setMethod('POST');
        $this->dispatch('neatline/records');
        $this->assertAction('login');
    }


    /**
     * Public users should not be able to PUT records.
     */
    public function testCannotUpdateRecords()
    {
        $this->setPut(array());
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('login');
    }


    /**
     * Public users should not be able to DELETE records.
     */
    public function testCannotDeleteRecords()
    {
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('login');
    }


}
