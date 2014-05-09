<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsAllow extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_loginAsContributor();
        $this->exhibit = $this->_exhibit('slug');
    }


    /**
     * Contributors should be able to create their own exhibits.
     */
    public function testCanCreateOwnExhibits()
    {

        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');

    }


    /**
     * Contributors should be able to edit their own exhibits.
     */
    public function testCanEditOwnExhibits()
    {

        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

    }


    /**
     * Contributors should be able to import items into their own exhibits.
     */
    public function testCanImportItemsIntoOwnExhibits()
    {

        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

    }


    /**
     * Contributors should be able to update their own exhibits.
     */
    public function testCanUpdateOwnExhibits()
    {
        $this->_setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to open the editor for their own exhibits.
     */
    public function testCanOpenEditorForOwnExhibits()
    {
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to open the delete confirmation modal for
     * their own exhibits.
     */
    public function testCanOpenDeleteModalForOwnExhibits()
    {
        $this->dispatch('neatline/delete-confirm/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Contributors should be able to delete their own exhibits.
     */
    public function testCanDeleteOwnExhibits()
    {
        $this->request->setMethod('POST');
        $this->setExpectedException('Omeka_Controller_Exception_404');
        $this->dispatch('neatline/delete/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


}
