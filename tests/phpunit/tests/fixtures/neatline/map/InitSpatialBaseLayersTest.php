<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapInitSpatialBaseLayers
    extends Neatline_Case_Fixture
{


    public function testExhibit()
    {

        $this->exhibit->spatial_layer = 'StamenToner';
        $this->exhibit->spatial_layers = implode(',', array(
            'OpenStreetMap',
            'StamenToner',
            'StamenWatercolor',
            'StamenTerrain'
        ));

        $this->exhibit->save();

        $this->_writeExhibitMarkupFixture($this->exhibit,
            'NeatlineMapInitSpatialBaseLayers.html'
        );

    }


}
