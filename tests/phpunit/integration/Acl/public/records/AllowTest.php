<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicRecordsAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit  = $this->__exhibit('slug');
        $this->record   = $this->__record($this->exhibit);
        $this->logout();
    }


    /**
     * Public users should be able to GET individual records.
     */
    public function testCanGetRecords()
    {
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to GET collections of records.
     */
    public function testCanListRecords()
    {

        $this->request->setQuery(array(
            'exhibit_id' => $this->exhibit->id
        ));

        $this->dispatch('neatline/records');
        $this->assertNotAction('login');

    }


}
