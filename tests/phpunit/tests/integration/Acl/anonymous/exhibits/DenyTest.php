<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_AnonymousExhibitsDeny extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->exhibit = $this->_exhibit('slug');
        $this->_logout();
    }


    /**
     * Anonymous users should not be able to update exhibits.
     */
    public function testCannotPutExhibits()
    {
        $this->_setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertAction('login');
    }


    /**
     * Anonymous users should not be able edit details for exhibits.
     */
    public function testCannotEditExhibits()
    {

        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('login');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('login');

    }


    /**
     * Anonymous users should not be able to import items into exhibits.
     */
    public function testCannotImportItemsIntoExhibits()
    {

        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('login');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('login');

    }


    /**
     * Anonymous users should not be able to open the exhibit editor.
     */
    public function testCannotOpenExhibitEditor()
    {
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertAction('login');
    }


    /**
     * Anonymous users should not be able to delete exhibits.
     */
    public function testCannotDeleteExhibits()
    {
        $this->request->setMethod('POST');
        $this->dispatch('neatline/delete/'.$this->exhibit->id);
        $this->assertAction('login');
    }


}
