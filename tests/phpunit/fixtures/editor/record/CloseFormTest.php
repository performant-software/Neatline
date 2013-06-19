<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordCloseForm extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record = $this->__record($this->exhibit);
        $record->coverage = 'POINT(1 2)';
        $record->point_radius = 10;
        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'EditorRecordCloseForm.records.json'
        );

        $this->resetRequest();
        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'EditorRecordCloseForm.record.json'
        );

    }


}
