<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getExhibitWidgets`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetExhibitWidgets
    extends Neatline_Test_AppTestCase
{


    /**
     * Register mock widgets.
     */
    public function setUp()
    {

        parent::setUp();

        // Mock widgets callback.
        if (!function_exists('getExhibitWidgets_widgets')) {
            function getExhibitWidgets_widgets($widgets)
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
                        'exhibit_form' => 'form'
                    )
                ));
            }
        }

        // Register filter callback.
        add_filter('neatline_widgets', 'getExhibitWidgets_widgets');

    }


    /**
     * `_nl_getExhibitWidgets` should return an array of widgets that are
     * enabled on the exhibit and register a exhibit form.
     */
    public function testGetExhibitWidgets()
    {

        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget2,Widget3';
        $widgets = _nl_getExhibitWidgets($exhibit);

        // Just the active widget with the record form.
        $this->assertArrayHasKey('Widget 3 Label', $widgets);
        $this->assertCount(1, $widgets);

    }


}
