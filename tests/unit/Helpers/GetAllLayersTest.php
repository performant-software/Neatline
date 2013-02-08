<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_getAllLayers()`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetAllLayers
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
     * _nl_getAllLayers() should parse the JSON in the passed file.
     */
    public function testGetAllLayers()
    {

        $layers = _nl_getAllLayers();

        $this->assertEquals(_nl_getAllLayers(), array(
            'group1' => array(
                array(
                    'title'  => 'Layer 1',
                    'id'    => 'Layer1',
                    'type'  => 'Type1'
                ),
                array(
                    'title'  => 'Layer 2',
                    'id'    => 'Layer2',
                    'type'  => 'Type2'
                )
            ),
            'group2' => array(
                array(
                    'title'  => 'Layer 3',
                    'id'    => 'Layer3',
                    'type'  => 'Type3'
                ),
                array(
                    'title'  => 'Layer 4',
                    'id'    => 'Layer4',
                    'type'  => 'Type4'
                )
            ),
            'group3' => array(
                array(
                    'title'  => 'Layer 5',
                    'id'    => 'Layer5',
                    'type'  => 'Type5'
                ),
                array(
                    'title'  => 'Layer 6',
                    'id'    => 'Layer6',
                    'type'  => 'Type6'
                )
            )
        ));

    }


}
