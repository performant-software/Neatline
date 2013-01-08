<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `updateTag()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_UpdateTag
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * updateTag() should replace all instances of a given tag in the tags
     * field on data records with a different name.
     * --------------------------------------------------------------------
     */
    public function testUpdateTag()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create record.
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1,tag2,tag3';
        $record->save();

        // Update `tag1`, reload record, check string.
        $this->_recordsTable->updateTag($exhibit, 'tag1', 'tag1NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2,tag3');

        // Update `tag2`, reload record, check string.
        $this->_recordsTable->updateTag($exhibit, 'tag2', 'tag2NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2NEW,tag3');

        // Update `tag3`, reload record, check string.
        $this->_recordsTable->updateTag($exhibit, 'tag3', 'tag3NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2NEW,tag3NEW');

    }


}
