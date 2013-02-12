<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getLayersForSelect`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetLayersForSelect
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
     * `_nl_getLayersForSelect` should convert the layers JSON to an array
     * of `id` => `name` pairs.
     */
    public function testGetLayersForSelect()
    {
        $this->assertEquals(_nl_getLayersForSelect(), array(
            'Group1' => array(
                'Layer1' => 'Layer 1',
                'Layer2' => 'Layer 2'
            ),
            'Group2' => array(
                'Layer3' => 'Layer 3',
                'Layer4' => 'Layer 4'
            ),
            'Group3' => array(
                'Layer5' => 'Layer 5',
                'Layer6' => 'Layer 6'
            )
        ));
    }


}
