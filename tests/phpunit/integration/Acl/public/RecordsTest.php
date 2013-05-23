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
     * Public users should be able to `get` records.
     */
    public function testAllowGet()
    {
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNotEmpty($this->getResponseArray());
    }


    /**
     * Public users should be able to `list` records.
     */
    public function testAllowList()
    {

        $this->request->setQuery(array(
            'exhibit_id' => $this->exhibit->id
        ));

        $this->dispatch('neatline/records');
        $this->assertNotEmpty($this->getResponseArray());

    }


    /**
     * Public users should NOT be able to `post` records.
     */
    public function testBlockPost()
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
     * Public users should NOT be able to `put` records.
     */
    public function testBlockPut()
    {
        $this->writePut(array('title' => 'title'));
        $this->dispatch('neatline/records/'.$this->record->id);
        $this->assertNull($this->reload($this->record)->title);
    }


    /**
     * Public users should NOT be able to `delete` records.
     */
    public function testBlockDelete()
    {

        $this->request->setMethod('DELETE');

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records/'.$this->record->id);
        $c2 = $this->__records->count();

        $this->assertEquals($c2, $c1);

    }


}
