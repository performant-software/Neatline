<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitDefaultBaseLayer
    extends Neatline_Case_Migration_200
{


    /**
     * The old `default_base_layer` foreign key references should be moved to
     * the corresponding layer slugs in the new `spatial_layers` field.
     */
    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessExhibitDefaultBaseLayer.exhibits');

        $this->_upgrade();
        $this->_migrate();

    }


    public function testOpenStreetMap()
    {
        $this->assertEquals(
            'OpenStreetMap',
            $this->_getExhibitByTitle('OpenStreetMap')->spatial_layer
        );
    }


    public function testGooglePhysical()
    {
        $this->assertEquals(
            'GooglePhysical',
            $this->_getExhibitByTitle('GooglePhysical')->spatial_layer
        );
    }


    public function testGoogleStreets()
    {
        $this->assertEquals(
            'GoogleStreets',
            $this->_getExhibitByTitle('GoogleStreets')->spatial_layer
        );
    }


    public function testGoogleHybrid()
    {
        $this->assertEquals(
            'GoogleHybrid',
            $this->_getExhibitByTitle('GoogleHybrid')->spatial_layer
        );
    }


    public function testGoogleSatellite()
    {
        $this->assertEquals(
            'GoogleSatellite',
            $this->_getExhibitByTitle('GoogleSatellite')->spatial_layer
        );
    }


    public function testStamenWatercolor()
    {
        $this->assertEquals(
            'StamenWatercolor',
            $this->_getExhibitByTitle('StamenWatercolor')->spatial_layer
        );
    }


    public function testStamenToner()
    {
        $this->assertEquals(
            'StamenToner',
            $this->_getExhibitByTitle('StamenToner')->spatial_layer
        );
    }


    public function testStamenTerrain()
    {
        $this->assertEquals(
            'StamenTerrain',
            $this->_getExhibitByTitle('StamenTerrain')->spatial_layer
        );
    }


}
