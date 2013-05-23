<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_PublicShow extends Neatline_DefaultCase
{


    protected $_isAdminTest = false;


    /**
     * SHOW should load exhibits by slug.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->__exhibit('slug');
        $this->dispatch('neatline/show/slug');
        $this->assertEquals(nl_getExhibitField('id'), $exhibit->id);
    }


    /**
     * SHOW should display exhibit container.
     */
    public function testBaseMarkup()
    {
        $exhibit = $this->__exhibit();
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertXpath('//div[@id="editor"]');
    }


}
