<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set/get.
     */
    public function testFieldAccess()
    {

        $exhibit = new NeatlineExhibit();

        $exhibit->title         = '1';
        $exhibit->slug          = '2';
        $exhibit->description   = '3';
        $exhibit->public        = 4;
        $exhibit->styles        = '5';
        $exhibit->map_focus     = '6';
        $exhibit->map_zoom      = 7;
        $exhibit->save();

        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        $this->assertEquals($exhibit->title,        '1');
        $this->assertEquals($exhibit->slug,         '2');
        $this->assertEquals($exhibit->description,  '3');
        $this->assertEquals($exhibit->public,       4);
        $this->assertEquals($exhibit->styles,       '5');
        $this->assertEquals($exhibit->map_focus,    '6');
        $this->assertEquals($exhibit->map_zoom,     7);

    }


}
