<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordWmsLayers
    extends Neatline_Case_Migrate
{


    public function setUp()
    {

        parent::setUp();
        $this->_createServicesTable();

        $this->_loadFixture('ProcessRecordWmsLayers.services');
        $this->_loadFixture('ProcessRecordWmsLayers.records');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If a record has a WMS service and is active on the map, the WMS address
     * and layers fields should be populated.
     */
    public function testActive()
    {
        $active = $this->_getRecordByTitle('Active');
        $this->assertEquals('active address',   $active->wms_address);
        $this->assertEquals('active layers',    $active->wms_layers);
    }


    /**
     * If the record has a WMS service but was _not_ active on the map, the
     * WMS fields should be left empty.
     */
    public function testInactive()
    {
        $inactive = $this->_getRecordByTitle('Inactive');
        $this->assertNull($inactive->wms_address);
        $this->assertNull($inactive->wms_layers);
    }


}
