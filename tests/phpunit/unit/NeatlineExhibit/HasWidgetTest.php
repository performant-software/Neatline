<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `hasWidget` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_HasWidget
    extends Neatline_Test_AppTestCase
{


    /**
     * `hasWidget` should return true if the widget is enabled.
     */
    public function testHasWidget()
    {

        $exhibit = $this->__exhibit();
        $exhibit->widgets = 'Widget1,Widget2';

        // True if the widget is enabled.
        $this->assertTrue($exhibit->hasWidget('Widget1'));
        $this->assertTrue($exhibit->hasWidget('Widget2'));

        // False if widget is not enabled.
        $this->assertFalse($exhibit->hasWidget('Widget3'));

    }


}
