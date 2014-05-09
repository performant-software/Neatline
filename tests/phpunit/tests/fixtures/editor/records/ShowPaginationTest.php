<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_RecordsPagination extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        for ($i = 0; $i<6; $i++) {
            $record = new NeatlineRecord($this->exhibit);
            $record->added = '200'.$i.'-01-01';
            $record->title = 'Record'.$i;
            $record->save();
        }

        // Records 1-2.
        $this->request->setQuery(array('limit' => '2', 'start' => '0'));
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsShowPagination.p12.json'
        );

        // Records 2-3.
        $this->request->setQuery(array('limit' => '2', 'start' => '1'));
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsShowPagination.p23.json'
        );

        // Records 3-4.
        $this->request->setQuery(array('limit' => '2', 'start' => '2'));
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsShowPagination.p34.json'
        );

        // Records 5-6.
        $this->request->setQuery(array('limit' => '2', 'start' => '4'));
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsShowPagination.p56.json'
        );

        // Record 6.
        $this->request->setQuery(array('limit' => '2', 'start' => '5'));
        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsShowPagination.p6.json'
        );

    }


}
