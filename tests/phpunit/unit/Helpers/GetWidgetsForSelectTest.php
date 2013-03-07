<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getWidgetsForSelect`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetWidgetsForSelect
    extends Neatline_Test_AppTestCase
{


    /**
     * `_nl_getWidgetsForSelect` should construct an array of <ID> =>
     * <TITLE> dropdown select options.
     */
    public function testGetLayersForSelect()
    {
        $this->assertEquals(_nl_getWidgetsForSelect(), array(
            'Widget1' => 'Widget1 Label',
            'Widget2' => 'Widget2 Label',
            'Widget3' => 'Widget3 Label'
        ));
    }


}
