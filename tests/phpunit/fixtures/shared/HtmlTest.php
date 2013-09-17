<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_SharedHtml extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    /**
     * Mock the widgets, presenters, and exhibit.
     */
    public function setUp()
    {

        parent::setUp();
        $this->_mockRecordWidgets();
        $this->_mockPresenters();

        $this->exhibit = $this->_exhibit();
        $this->exhibit->spatial_layer = 'OpenStreetMap';
        $this->exhibit->save();

    }


    public function testNeatlinePartial()
    {
        $this->_writeExhibitMarkupFixture(
            $this->exhibit, 'SharedHtml.exhibit.html'
        );
    }


    public function testEditorPartial()
    {
        $this->_writeEditorMarkupFixture(
            $this->exhibit, 'SharedHtml.editor.html'
        );
    }


}
