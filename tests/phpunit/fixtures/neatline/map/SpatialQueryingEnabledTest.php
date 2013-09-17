<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapSpatialQueryingEnabled
    extends Neatline_Case_Fixture
{


    protected $_isAdminTest = false;


    public function testExhibit()
    {

        $exhibit = $this->_exhibit();
        $exhibit->spatial_layer = 'OpenStreetMap';
        $exhibit->spatial_querying = 1;
        $exhibit->save();

        $this->_writeExhibitMarkupFixture(
            $exhibit, 'NeatlineMapSpatialQueryingEnabled.html'
        );

    }


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);

        $record1->coverage = 'POINT(1 2)';
        $record2->coverage = 'POINT(3 4)';

        $record1->save();
        $record2->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapSpatialQueryingEnabled.two.json'
        );

        $record2->delete();

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapSpatialQueryingEnabled.one.json'
        );

    }


}
