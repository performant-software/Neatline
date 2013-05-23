<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicRecordsAllow extends Neatline_DefaultCase
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
     * Public users should be able to get individual records.
     */
    public function testCanGetExhibits()
    {
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotAction('login');
    }


    /**
     * Public users should be able to get collections of records.
     */
    public function testCanListExhibits()
    {

        $this->request->setQuery(array(
            'exhibit_id' => $this->exhibit->id
        ));

        $this->dispatch('neatline/records');
        $this->assertNotAction('login');

    }


}
