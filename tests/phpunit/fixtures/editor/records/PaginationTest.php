<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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
        $this->request->setQuery(array('limit' => 2, 'offset' => 0));
        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsPagination.p12.json'
        );

        // Records 2-3.
        $this->request->setQuery(array('limit' => 2, 'offset' => 1));
        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsPagination.p23.json'
        );

        // Records 3-4.
        $this->request->setQuery(array('limit' => 2, 'offset' => 2));
        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsPagination.p34.json'
        );

        // Records 5-6.
        $this->request->setQuery(array('limit' => 2, 'offset' => 4));
        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsPagination.p56.json'
        );

        // Record 6.
        $this->request->setQuery(array('limit' => 2, 'offset' => 5));
        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsPagination.p6.json'
        );

    }


}
