<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ResearcherExhibitsAllow extends Neatline_DefaultCase
{


    public function setUp()
    {
        parent::setUp();
        $this->loginAsResearcher();
        $this->exhibit = $this->__exhibit('slug');
    }


    /**
     * Researchers should be able to create their own exhibits.
     */
    public function testCanCreateOwnExhibits()
    {

        $this->request->setMethod('GET');
        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');

    }


    /**
     * Researchers should be able to edit settings for their own exhibits.
     */
    public function testCanEditOwnExhibits()
    {

        $this->request->setMethod('GET');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

    }


    /**
     * Researchers should be able to import items to their own exhibits.
     */
    public function testCanImportItemsIntoOwnExhibits()
    {

        $this->request->setMethod('GET');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');

    }


    /**
     * Researchers should be able to update their own exhibits.
     */
    public function testCanUpdateOwnExhibits()
    {
        $this->setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Researchers should be able to open editor for their own exhibits.
     */
    public function testCanOpenEditorForOwnExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Researchers should be able to view the delete-confirm modal.
     */
    public function testCanOpenDeleteModalForOwnExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/delete-confirm/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Researchers should be able delete their own exhibits.
     */
    public function testCanDeleteOwnExhibits()
    {
        $this->request->setMethod('POST');
        $this->setExpectedException('Omeka_Controller_Exception_404');
        $this->dispatch('neatline/delete/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


}
