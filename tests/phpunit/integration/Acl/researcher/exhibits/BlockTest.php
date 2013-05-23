<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ResearcherExhibitsBlock extends Neatline_DefaultCase
{


    public function setUp()
    {
        parent::setUp();
        $this->loginAsResearcher('user1');
        $this->exhibit = $this->__exhibit('slug');
        $this->loginAsResearcher('user2');
    }


    /**
     * Researchers should be NOT able to edit settings for other users'
     * exhibits.
     */
    public function testCannotEditOtherUsersExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('forbidden');
        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Researchers should NOT be able to import items into other users'
     * exhibits.
     */
    public function testCannotImportItemsIntoOtherUsersExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('forbidden');
        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Researchers should NOT be able to update other users' exhibits.
     */
    public function testCannotUpdateOtherUsersExhibits()
    {
        $this->setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Researchers should NOT be able to open the editor for other users'
     * exhibits.
     */
    public function testCannotOpenEditorForOtherUsersExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Should NOT be able delete other users' exhibits.
     */
    public function testCannotDeleteOtherUsersExhibits()
    {
        $this->request->setMethod('POST');
        $this->dispatch('neatline/delete/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


}
