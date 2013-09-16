<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_PublicFullscreen
    extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->_mockTheme();
    }


    /**
     * FULLSCREEN should load the exhibit by slug.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->_exhibit('slug');
        $this->dispatch('neatline/fullscreen/slug');
        $this->assertEquals(nl_getExhibitField('id'), $exhibit->id);
    }


}
