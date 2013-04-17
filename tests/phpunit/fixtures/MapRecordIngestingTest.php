<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Map Record Ingesting" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_MapRecordIngesting extends Neatline_RecordsFixtureCase
{


    /**
     * `MapRecordIngesting.records.two.json`
     * `MapRecordIngesting.records.one.json`
     */
    public function testMapRecordIngesting()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record1->coverage = 'POINT(1 2)';
        $record2->coverage = 'POINT(3 4)';
        $record1->save();
        $record2->save();

        $this->writeFixtureFromRoute('neatline/records',
            'MapRecordIngesting.records.two.json'
        );

        $record2->delete();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'MapRecordIngesting.records.one.json'
        );

    }


}
