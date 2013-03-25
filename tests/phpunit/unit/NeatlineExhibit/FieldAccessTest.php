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

        $exhibit->query         = '1';
        $exhibit->base_layers   = '2';
        $exhibit->base_layer    = '3';
        $exhibit->widgets       = '4';
        $exhibit->title         = '5';
        $exhibit->slug          = '6';
        $exhibit->description   = '7';
        $exhibit->public        = 8;
        $exhibit->styles        = '9';
        $exhibit->map_focus     = '10';
        $exhibit->map_zoom      = 11;
        $exhibit->save();

        $exhibit = $this->__exhibits->find($exhibit->id);

        $this->assertEquals($exhibit->query,        '1');
        $this->assertEquals($exhibit->base_layers,  '2');
        $this->assertEquals($exhibit->base_layer,   '3');
        $this->assertEquals($exhibit->widgets,      '4');
        $this->assertEquals($exhibit->title,        '5');
        $this->assertEquals($exhibit->slug,         '6');
        $this->assertEquals($exhibit->description,  '7');
        $this->assertEquals($exhibit->public,       8);
        $this->assertEquals($exhibit->styles,       '9');
        $this->assertEquals($exhibit->map_focus,    '10');
        $this->assertEquals($exhibit->map_zoom,     11);

    }


}
