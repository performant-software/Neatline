<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordsTemplating extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->body  = 'body1';
        $record2->body  = 'body2';
        $record3->body  = 'body3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsTemplating.defaultList.json'
        );

        $record1->title = '<tag>title</tag>';
        $record1->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsTemplating.titleTags.json'
        );

        $record1->title = null;
        $record1->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecordsTemplating.emptyTitle.json'
        );

    }


}
