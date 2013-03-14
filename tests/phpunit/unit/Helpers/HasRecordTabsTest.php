<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_hasRecordTabs`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_HasRecordTabs
    extends Neatline_Test_AppTestCase
{


    /**
     * Register mock widgets.
     */
    public function setUp()
    {

        parent::setUp();

        // Mock widgets callback.
        if (!function_exists('hasRecordTabs_widgets')) {
            function hasRecordTabs_widgets($widgets)
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
        add_filter('neatline_widgets', 'hasRecordTabs_widgets');

    }


    /**
     * `_nl_hasRecordTabs` should return false when none of the widgets
     * on the exhibit registers a record form tab.
     */
    public function testNoRecordTabs()
    {

        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget1';

        // False when no record tabs.
        $this->assertFalse(_nl_hasRecordTabs($exhibit));

    }


    /**
     * `_nl_hasRecordTabs` should return true when at one or more of the
     * widgets on the exhibit registers a record form tab.
     */
    public function testRecordTabs()
    {

        $exhibit = new NeatlineExhibit;
        $exhibit->widgets = 'Widget2';

        // True when record tabs.
        $this->assertTrue(_nl_hasRecordTabs($exhibit));

    }


}
