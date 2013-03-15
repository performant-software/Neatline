<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_hasExhibitWidgets`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_HasExhibitWidgets
    extends Neatline_Test_AppTestCase
{


    /**
     * Register mock widgets.
     */
    public function setUp()
    {

        parent::setUp();

        // Mock widgets callback.
        if (!function_exists('hasExhibitWidgets_widgets')) {
            function hasExhibitWidgets_widgets($widgets)
            {
                return array_merge($widgets, array(
                    'Widget 1 Label' => array(
                        'id' => 'Widget1'
                    ),
                    'Widget 2 Label' => array(
                        'id' => 'Widget2',
                        'exhibit_form' => 'form'
                    )
                ));
            }
        }

        // Register filter callback.
        add_filter('neatline_widgets', 'hasExhibitWidgets_widgets');

    }


    /**
     * `_nl_hasExhibitWidgets` should return false when none of the
     * widgets on the exhibit registers an exhibit form.
     */
    public function testNoForms()
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget1';
        $this->assertFalse(_nl_hasExhibitWidgets($exhibit));
    }


    /**
     * `_nl_hasExhibitWidgets` should return true when one or more of the
     * widgets on the exhibit registers an exhibit form.
     */
    public function testForms()
    {
        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget2';
        $this->assertTrue(_nl_hasExhibitWidgets($exhibit));
    }


}
