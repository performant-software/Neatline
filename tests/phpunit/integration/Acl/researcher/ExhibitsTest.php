<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ResearcherExhibit extends Neatline_DefaultCase
{


    public function setUp()
    {
        parent::setUp();
        $this->loginAsResearcher();
        $this->exhibit = $this->__exhibit('slug');
    }


    /**
     * Should be able to create their own exhibits.
     */
    public function testAllowAddSelf()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');
        $this->request->setMethod('POST');
        $this->dispatch('neatline/add');
        $this->assertNotAction('forbidden');
    }


    /**
     * Should be able to edit settings for their own exhibits.
     */
    public function testAllowEditSelf()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Should be able to import items into their own exhibits.
     */
    public function testAllowImportSelf()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Should be able to update their own exhibits.
     */
    public function testAllowPutSelf()
    {
        $this->writePut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Should be able to open the editor for their own exhibits.
     */
    public function testAllowEditorSelf()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


    /**
     * Should be able see delete confirm message for their own exhibits.
     */
    public function testAllowDeleteConfirmSelf()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/delete-confirm/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


}
