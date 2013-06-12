<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsDeny extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->loginAsContributor('user1');
        $this->exhibit = $this->__exhibit();
        $this->loginAsContributor('user2');
    }


    /**
     * Contributors should not be able to edit settings for other users'
     * exhibits.
     */
    public function testCannotEditOtherUsersExhibits()
    {

        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $this->assertAction('forbidden');

    }


    /**
     * Contributors should not be able to import items into other users'
     * exhibits.
     */
    public function testCannotImportItemsIntoOtherUsersExhibits()
    {

        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('forbidden');

        $this->request->setMethod('POST');
        $this->dispatch('neatline/import/'.$this->exhibit->id);
        $this->assertAction('forbidden');

    }


    /**
     * Contributors should not be able to update other users' exhibits.
     */
    public function testCannotUpdateOtherUsersExhibits()
    {
        $this->setPut(array());
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Contributors should not be able to open the editor for other users'
     * exhibits.
     */
    public function testCannotOpenEditorForOtherUsersExhibits()
    {
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


    /**
     * Contributors should not be able delete other users' exhibits.
     */
    public function testCannotDeleteOtherUsersExhibits()
    {
        $this->request->setMethod('POST');
        $this->dispatch('neatline/delete/'.$this->exhibit->id);
        $this->assertAction('forbidden');
    }


}
