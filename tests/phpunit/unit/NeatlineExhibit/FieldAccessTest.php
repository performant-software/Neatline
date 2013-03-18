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

class NeatlineExhibitTest_FieldAccess extends Neatline_TestCase
{


    /**
     * Test field set/get.
     */
    public function testFieldAccess()
    {

        $exhibit = new NeatlineExhibit();

        $exhibit->base_layers   = '1';
        $exhibit->base_layer    = '2';
        $exhibit->widgets       = '3';
        $exhibit->title         = '4';
        $exhibit->slug          = '5';
        $exhibit->description   = '6';
        $exhibit->public        = 7;
        $exhibit->styles        = '8';
        $exhibit->map_focus     = '9';
        $exhibit->map_zoom      = 10;
        $exhibit->save();

        $exhibit = $this->__exhibits->find($exhibit->id);

        $this->assertEquals($exhibit->base_layers,  '1');
        $this->assertEquals($exhibit->base_layer,   '2');
        $this->assertEquals($exhibit->widgets,      '3');
        $this->assertEquals($exhibit->title,        '4');
        $this->assertEquals($exhibit->slug,         '5');
        $this->assertEquals($exhibit->description,  '6');
        $this->assertEquals($exhibit->public,       7);
        $this->assertEquals($exhibit->styles,       '8');
        $this->assertEquals($exhibit->map_focus,    '9');
        $this->assertEquals($exhibit->map_zoom,     10);

    }


}
