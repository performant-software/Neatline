<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Search Map Mirroring" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_SearchMapMirror extends Neatline_RecordsFixtureCase
{


    /**
     * `SearchMapMirror.records.list.json`
     */
    public function testListRecords()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);
        $record1->title = 'list1';
        $record2->title = 'list2';
        $record3->title = 'list3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'SearchMapMirror.records.list.json'
        );

    }


    /**
     * `SearchMapMirror.records.map.json`
     */
    public function testMapRecords()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);
        $record1->title = 'map1';
        $record2->title = 'map2';
        $record3->title = 'map3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'SearchMapMirror.records.map.json'
        );

    }


}
