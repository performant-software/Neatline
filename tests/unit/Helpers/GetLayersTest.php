<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getLayers()`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetLayers
    extends Neatline_Test_AppTestCase
{


    /**
     * _nl_getLayers() should filter the layers.json file and return just
     * the layers included in the passed list of id's.
     */
    public function testGetAllLayers()
    {

        $file = NL_DIR . '/tests/mocks/layers.json';
        $layers = _nl_getLayers('Layer1,Layer3,Layer5', $file);

        $this->assertEquals($layers, array(
            array(
                'name'  => 'Layer 1',
                'id'    => 'Layer1',
                'type'  => 'Type1'
            ),
            array(
                'name'  => 'Layer 3',
                'id'    => 'Layer3',
                'type'  => 'Type3'
            ),
            array(
                'name'  => 'Layer 5',
                'id'    => 'Layer5',
                'type'  => 'Type5'
            )
        ));

    }


    /**
     * _nl_getLayers() should scrub whitespace from the layers string.
     */
    public function testScrubWhitespace()
    {

        $file = NL_DIR . '/tests/mocks/layers.json';
        $layers = _nl_getLayers(' Layer1, Layer3, Layer5 ', $file);

        $this->assertEquals($layers, array(
            array(
                'name'  => 'Layer 1',
                'id'    => 'Layer1',
                'type'  => 'Type1'
            ),
            array(
                'name'  => 'Layer 3',
                'id'    => 'Layer3',
                'type'  => 'Type3'
            ),
            array(
                'name'  => 'Layer 5',
                'id'    => 'Layer5',
                'type'  => 'Type5'
            )
        ));

    }


}
