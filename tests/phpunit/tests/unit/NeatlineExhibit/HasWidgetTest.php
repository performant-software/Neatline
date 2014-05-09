<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_HasWidget extends Neatline_Case_Default
{


    /**
     * `hasWidget` should return true if the widget is enabled.
     */
    public function testHasWidget()
    {

        $exhibit = $this->_exhibit();
        $exhibit->widgets = 'Widget1,Widget2';

        // True if the widget is enabled.
        $this->assertTrue($exhibit->hasWidget('Widget1'));
        $this->assertTrue($exhibit->hasWidget('Widget2'));

        // False if widget is not enabled.
        $this->assertFalse($exhibit->hasWidget('Widget3'));

    }


}
