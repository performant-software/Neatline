<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsAllow extends Neatline_DefaultCase
{


    public function setUp()
    {
        parent::setUp();
        $this->loginAsContributor('user1');
        $this->exhibit = $this->__exhibit();
        $this->loginAsContributor('user2');
    }


    /**
     * Contributors should be able to open the editor for other users'
     * exhibits.
     */
    public function testCanOpenEditorForOtherUsersExhibits()
    {
        $this->request->setMethod('GET');
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertNotAction('forbidden');
    }


}
