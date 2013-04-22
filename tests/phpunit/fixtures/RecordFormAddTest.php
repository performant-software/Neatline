<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_RecordFormAdd extends Neatline_FixtureCase
{


    /**
     * `RecordFormAdd.records.json`
     * `RecordFormAdd.record.json`
     */
    public function testRecords()
    {

        $record = $this->__record($this->exhibit);
        $record->coverage = 'POINT(1 2)';
        $record->save();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'RecordFormAdd.records.json'
        );

        $this->resetResponse();
        $this->resetRequest();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'RecordFormAdd.record.json'
        );

    }


}
