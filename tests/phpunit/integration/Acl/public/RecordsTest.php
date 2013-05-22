<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_PublicRecord extends Neatline_DefaultCase
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
     * Should be able to GET records.
     */
    public function testCanGet()
    {
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotEmpty($this->getResponseArray());
    }


    /**
     * Should be able to LIST records.
     */
    public function testCanList()
    {

        $this->request->setQuery(array(
            'exhibit_id' => $this->exhibit->id
        ));

        $this->dispatch('neatline/records');
        $this->assertNotEmpty($this->getResponseArray());

    }


    /**
     * Should not be able to POST records.
     */
    public function testCannotPost()
    {

        $this->request->setMethod('POST')->setRawBody(
            Zend_Json::encode(array(
                'exhibit_id' => $this->exhibit->id
            ))
        );

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records');
        $c2 = $this->__records->count();

        $this->assertEquals($c2, $c1);

    }


    /**
     * Should not be able to PUT records.
     */
    public function testCannotPut()
    {
        $this->writePut(array('title' => 'title'));
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNull($this->reload($this->record)->title);
    }


    /**
     * Should not be able to DELETE records.
     */
    public function testCannotDelete()
    {

        $this->request->setMethod('DELETE');

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records/'.$this->record->id);
        $c2 = $this->__records->count();

        $this->assertEquals($c2, $c1);

    }


}
