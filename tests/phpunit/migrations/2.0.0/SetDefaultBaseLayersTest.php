<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_SetDefaultBaseLayers extends Neatline_Case_Migrate200
{


    /**
     * The old `default_base_layer` foreign key references should be moved
     * to the corresponding layer slugs in the new `base_layers` field.
     */
    public function testSetDefaultBaseLayers()
    {

        $this->_loadFixture('SetDefaultBaseLayers.exhibits');

        $this->_upgrade();
        $this->_migrate();

        $this->assertEquals(
            $this->_getExhibitByTitle('OpenStreetMap')->base_layer,
            'OpenStreetMap'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('GooglePhysical')->base_layer,
            'GooglePhysical'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('GoogleStreets')->base_layer,
            'GoogleStreets'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('GoogleHybrid')->base_layer,
            'GoogleHybrid'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('GoogleSatellite')->base_layer,
            'GoogleSatellite'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('StamenWatercolor')->base_layer,
            'StamenWatercolor'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('StamenToner')->base_layer,
            'StamenToner'
        );

        $this->assertEquals(
            $this->_getExhibitByTitle('StamenTerrain')->base_layer,
            'StamenTerrain'
        );

    }


}
