<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapSubscriptions
    extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record = $this->_record($this->exhibit);

        $record->setArray(array(
            'point_radius'  => 1,
            'coverage'      => 'POINT(1 2)',
            'map_focus'     => '100,200',
            'map_zoom'      => 10
        ));

        $record->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapSubscriptions.records.json'
        );

        $this->resetRequest();
        $this->_writeFixtureFromRoute('neatline/records/'.$record->id,
            'NeatlineMapSubscriptions.record.json'
        );

    }


}
