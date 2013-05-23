<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicRecordsBlock extends Neatline_DefaultCase
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
     * Public users should NOT be able to create new records.
     */
    public function testCannotCreateRecords()
    {
        $this->request->setMethod('POST');
        $this->dispatch('neatline/records');
        $this->assertAction('login');
    }


    /**
     * Public users should NOT be able to `put` records.
     */
    public function testCannotUpdateRecords()
    {
        $this->setPut(array());
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('login');
    }


    /**
     * Public users should NOT be able to delete records.
     */
    public function testCannotDeleteRecords()
    {
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertAction('login');
    }


}
