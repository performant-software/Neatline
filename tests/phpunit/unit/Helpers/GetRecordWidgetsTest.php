<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getRecordWidgets`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetRecordWidgets
    extends Neatline_Test_AppTestCase
{


    /**
     * Register mock widgets.
     */
    public function setUp()
    {

        parent::setUp();

        // Mock widgets callback.
        if (!function_exists('getRecordWidgets_widgets')) {
            function getRecordWidgets_widgets($widgets)
            {
                return array_merge($widgets, array(
                    'Widget 1 Label' => array(
                        'id' => 'Widget1'
                    ),
                    'Widget 2 Label' => array(
                        'id' => 'Widget2',
                    ),
                    'Widget 3 Label' => array(
                        'id' => 'Widget3',
                        'record_form' => 'form'
                    )
                ));
            }
        }

        // Register filter callback.
        add_filter('neatline_widgets', 'getRecordWidgets_widgets');

    }


    /**
     * `_nl_getRecordWidgets` should return an array of widgets that are
     * enabled on the exhibit and register a record form.
     */
    public function testGetRecordWidgets()
    {

        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget2,Widget3';
        $widgets = _nl_getRecordWidgets($exhibit);

        // Just the active widget with the record form.
        $this->assertArrayHasKey('Widget 3 Label', $widgets);
        $this->assertCount(1, $widgets);

    }


}
