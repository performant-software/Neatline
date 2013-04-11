<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Records List" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_RecordsList extends Neatline_RecordsFixtureCase
{


    /**
     * `RecordsList.records.regular.json`
     */
    public function testRegular()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);
        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->body = 'body1';
        $record2->body = 'body2';
        $record3->body = 'body3';
        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'RecordsList.records.regular.json'
        );

    }


    /**
     * `RecordsList.records.html.json`
     */
    public function testHtmlTagsInTitle()
    {

        $record = $this->__record($this->exhibit);
        $record->title = '<tag>title</tag>';
        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'RecordsList.records.html.json'
        );

    }


    /**
     * `RecordsList.records.empty.json`
     */
    public function testEmptyTitle()
    {

        $record = $this->__record($this->exhibit);

        $this->writeFixtureFromRoute('neatline/records',
            'RecordsList.records.empty.json'
        );

    }


}
