<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ContributorExhibitsPrivateDeny extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        // TODO
    }


    /**
     * Contributors should not be able to view private exhibits owned by
     * other users.
     */
    public function testCannotViewOtherUsersPrivateExhibits()
    {
        // TODO
    }


    /**
     * Contributors should not be able to view browse listings for private
     * exhibits owned by other users.
     */
    public function testCanBrowseOtherUsersPrivateExhibits()
    {
        // TODO
    }


}
