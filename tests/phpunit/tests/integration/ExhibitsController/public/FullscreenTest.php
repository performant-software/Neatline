<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_PublicFullscreen
    extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * FULLSCREEN should load the exhibit by slug.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->_exhibit('slug');
        $this->dispatch('neatline/fullscreen/slug');
        $this->assertEquals($exhibit->id, nl_getExhibitField('id'));
    }


}
