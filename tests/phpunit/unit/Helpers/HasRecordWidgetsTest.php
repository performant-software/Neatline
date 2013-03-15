<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_hasRecordWidgets`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_HasRecordWidgets
    extends Neatline_Test_AppTestCase
{


    /**
     * Register mock widgets.
     */
    public function setUp()
    {

        parent::setUp();

        // Mock widgets callback.
        if (!function_exists('hasRecordWidgets_widgets')) {
            function hasRecordWidgets_widgets($widgets)
            {
                return array_merge($widgets, array(
                    'Widget 1 Label' => array(
                        'id' => 'Widget1'
                    ),
                    'Widget 2 Label' => array(
                        'id' => 'Widget2',
                        'record_form' => 'form'
                    )
                ));
            }
        }

        // Register filter callback.
        add_filter('neatline_widgets', 'hasRecordWidgets_widgets');

    }


    /**
     * `_nl_hasRecordWidgets` should return false when none of the widgets
     * on the exhibit registers a record form.
     */
    public function testNoForms()
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget1';
        $this->assertFalse(_nl_hasRecordWidgets($exhibit));
    }


    /**
     * `_nl_hasWidgetForms` should return true when one or more of the
     * widgets on the exhibit registers a form for the passed key.
     */
    public function testForms()
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget2';
        $this->assertTrue(_nl_hasRecordWidgets($exhibit));
    }


}
