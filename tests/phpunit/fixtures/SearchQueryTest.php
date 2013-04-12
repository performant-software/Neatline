<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Search Query Execution" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_SearchQuery extends Neatline_RecordsFixtureCase
{


    /**
     * `SearchQuery.records.json`
     */
    public function testSearchQuery()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);
        $record1->title = 'result1';
        $record2->title = 'result2';
        $record3->title = 'result3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'SearchQuery.records.json'
        );

    }


}
