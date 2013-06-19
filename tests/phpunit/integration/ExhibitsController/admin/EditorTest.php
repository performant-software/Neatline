<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminEditor extends Neatline_Case_Default
{


    /**
     * SHOW should load exhibits by id.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->__exhibit();
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertEquals(nl_getExhibitField('id'), $exhibit->id);
    }


    /**
     * EDITOR should display editor and exhibit containers.
     */
    public function testBaseMarkup()
    {
        $exhibit = $this->__exhibit();
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertQuery('#neatline');
        $this->assertQuery('#editor');
    }


}
