<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterTags
    extends Neatline_Case_Default
{


    /**
     * `queryRecords` should filter on a tags query.
     */
    public function testFilterTags()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);

        $record1->tags = 'tag1';
        $record2->tags = 'tag1,tag2';
        $record3->tags = 'tag3';

        $record1->save();
        $record2->save();
        $record3->save();

        // Query for tag1 and tag2.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'tags' => array('tag1', 'tag2')
        ));

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


}
