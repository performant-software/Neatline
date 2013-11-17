<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordOpenForm extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record3->coverage  = 'POINT(5 6)';
        $record1->map_focus = '100,200';
        $record2->map_focus = '100,200';
        $record3->map_focus = '100,200';
        $record1->map_zoom  = 10;
        $record2->map_zoom  = 10;
        $record3->map_zoom  = 10;
        $record1->added     = '2003-01-01';
        $record2->added     = '2002-01-01';
        $record3->added     = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordOpenForm.records.json'
        );

    }


}
