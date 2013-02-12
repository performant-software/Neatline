<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getLayersByIds`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetLayersByIds
    extends Neatline_Test_AppTestCase
{


    /**
     * Inject mock layers JSON.
     */
    public function setUp()
    {
        parent::setUp();
        Zend_Registry::set('layers', NL_DIR . '/tests/mocks/layers.json');
    }


    /**
     * `_nl_getLayersByIds` should read the `layers.json` file and return
     * just the layers included in the passed list of id's.
     */
    public function testGetLayersByIds()
    {

        $layers = _nl_getLayersByIds('Layer1,Layer3,Layer5');

        $this->assertEquals($layers, array(
            array(
                'title' => 'Layer 1',
                'id'    => 'Layer1',
                'type'  => 'Type1'
            ),
            array(
                'title' => 'Layer 3',
                'id'    => 'Layer3',
                'type'  => 'Type3'
            ),
            array(
                'title' => 'Layer 5',
                'id'    => 'Layer5',
                'type'  => 'Type5'
            )
        ));

    }


}
