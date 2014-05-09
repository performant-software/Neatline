<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordDeleteRecord extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';

        $record1->save();
        $record2->save();

        // Records 1 and 2.
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordDeleteRecord.records12.json'
        );

        // Delete record 2.
        $this->_writeRecordApiFixture($record2,
            'EditorRecordDeleteRecord.deleted.json', 'DELETE'
        );

        // Just record 1.
        $this->resetRequest();
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordDeleteRecord.records1.json'
        );

    }


}
