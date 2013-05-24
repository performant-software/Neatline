<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapRecordFocusing extends Neatline_Case_Fixture
{


    /**
     * `PublicMapRecordFocusing.records.json`
     * `PublicMapRecordFocusing.record.json`
     */
    public function testVector()
    {

        $record = $this->__record($this->exhibit);

        $record->setArray(array(
            'point_radius' => 1,
            'coverage'  => 'POINT(1 2)',
            'map_focus' => '100,200',
            'map_zoom'  => 10
        ));

        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapRecordFocusing.records.json'
        );

        $this->resetResponse();
        $this->resetRequest();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'PublicMapRecordFocusing.record.json'
        );

    }


}
