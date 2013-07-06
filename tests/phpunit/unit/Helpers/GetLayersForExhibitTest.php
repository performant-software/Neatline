<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_GetLayersForExhibit extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_mockLayers();
    }


    /**
     * `nl_getLayersForExhibit` should return layer definitions for the
     * layers included in the `api_layers` field.
     */
    public function testDefaultLayerIsIncluded()
    {

        $exhibit = $this->_exhibit();
        $exhibit->api_layers    = 'Layer1,Layer2';
        $exhibit->api_layer     = 'Layer2';

        $this->assertEquals(nl_getLayersForExhibit($exhibit), array(
            array(
                'title' => 'Layer 1',
                'id'    => 'Layer1',
                'type'  => 'Type1'
            ),
            array(
                'title' => 'Layer 2',
                'id'    => 'Layer2',
                'type'  => 'Type2'
            )
        ));

    }


    /**
     * When the default layer is not enabled for the exhibit, the default
     * layer should be merged into the array of definitions.
     */
    public function testDefaultLayerIsExcluded()
    {

        $exhibit = $this->_exhibit();
        $exhibit->api_layers    = 'Layer1,Layer2';
        $exhibit->api_layer     = 'Layer3';

        $this->assertEquals(nl_getLayersForExhibit($exhibit), array(
            array(
                'title' => 'Layer 1',
                'id'    => 'Layer1',
                'type'  => 'Type1'
            ),
            array(
                'title' => 'Layer 2',
                'id'    => 'Layer2',
                'type'  => 'Type2'
            ),
            array(
                'title' => 'Layer 3',
                'id'    => 'Layer3',
                'type'  => 'Type3'
            )
        ));

    }


}
