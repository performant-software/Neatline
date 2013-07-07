<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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
     * Set a mock exhibit object on the view.
     */
    public function setUp()
    {

        parent::setUp();

        nl_mockView();
        $this->_mockRecordWidgets();
        $this->_mockPresenters();

        // Create exhibit.
        $exhibit = $this->_exhibit();
        $exhibit->spatial_layer = 'OpenStreetMap';
        $exhibit->save();

        // Set exhibit on view.
        get_view()->neatline_exhibit = $exhibit;

    }


    public function testNeatlinePartial()
    {
        $this->_writeExhibitMarkupFixture('neatline-partial.html');
    }


    public function testEditorPartial()
    {
        $this->_writeEditorMarkupFixture('editor-partial.html');
    }


}
