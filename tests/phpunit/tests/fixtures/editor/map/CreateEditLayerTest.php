<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorMapCreateEditLayer extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';

        $record1->save();
        $record2->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapCreateEditLayer.records12.json'
        );

        $record3 = $this->_record($this->exhibit);
        $record3->title     = 'title3';
        $record3->coverage  = 'POINT(5 6)';
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapCreateEditLayer.records123.json'
        );

        $this->_writeRecordApiFixture($record3,
            'EditorMapCreateEditLayer.record3.json'
        );

    }


}
