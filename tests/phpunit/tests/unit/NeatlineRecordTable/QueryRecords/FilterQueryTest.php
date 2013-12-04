<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterQuery
    extends Neatline_Case_Default
{


    /**
     * `queryRecords` should search for keywords in the `title`, `body`, and
     * `slug` fields.
     */
    public function testFilterQuery()
    {

        $exhibit = $this->_exhibit();

        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->body  = 'body1';
        $record2->body  = 'body2';
        $record3->body  = 'body3';
        $record1->slug  = 'slug1';
        $record2->slug  = 'slug2';
        $record3->slug  = 'slug3';

        $record1->save();
        $record2->save();
        $record3->save();

        // Should search in `title` field.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'query' => 'title1'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Should search in `body` field.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'query' => 'body1'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

        // Should search in `slug` field.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'query' => 'slug1'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


}
