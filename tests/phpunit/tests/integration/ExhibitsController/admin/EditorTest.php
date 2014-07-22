<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminEditor extends Neatline_Case_Default
{


    /**
     * EDITOR should load exhibits by id.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->_exhibit();
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertEquals($exhibit->id, nl_getExhibitField('id'));
    }


    /**
     * EDITOR should display the editor and exhibit containers.
     */
    public function testBaseMarkup()
    {
        $exhibit = $this->_exhibit();
        $this->dispatch('neatline/editor/'.$exhibit->id);
        $this->assertQuery('#neatline');
        $this->assertQuery('#editor');
    }


    /**
     * EDITOR should load development assets when the Omeka `APPLICATION_ENV`
     * environment variable is set to `development`.
     */
    public function testLoadDevelopmentAssets()
    {

        // TODO
        // set the env variable
        // hit the page
        // check for the assets

    }


    /**
     * EDITOR should load production assets when the Omeka `APPLICATION_ENV`
     * environment variable is set to anything other than `development`.
     */
    public function testLoadProductionAssets()
    {
        // TODO
    }


}
