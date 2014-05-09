<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousRecordsAllow extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->_exhibit('slug');
        $this->record  = $this->_record($this->exhibit);
        $this->_logout();
    }


    /**
     * Anonymous users should be able to GET individual records.
     */
    public function testCanGetRecords()
    {
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotAction('login');
    }


    /**
     * Anonymous users should be able to GET collections of records.
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
