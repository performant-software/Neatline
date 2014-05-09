<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorSearchMapMirroring extends Neatline_Case_Fixture
{


    public function testListRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title = 'list1';
        $record2->title = 'list2';
        $record3->title = 'list3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorSearchMirrorMap.list.json'
        );

    }


    public function testMapRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title = 'map1';
        $record2->title = 'map2';
        $record3->title = 'map3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorSearchMirrorMap.map.json'
        );

    }


}
