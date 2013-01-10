<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `deleteTag()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_DeleteTag
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * deleteTag() should remove all instances of a given tag in the tags
     * field on data records.
     * --------------------------------------------------------------------
     */
    public function testDeleteTag()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create record.
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1,tag2,tag3,tag4';
        $record->save();

        // Delete `tag2`, reload record, check string.
        $this->_recordsTable->deleteTag($exhibit->id, 'tag2');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1,tag3,tag4');

        // Delete `tag1`, reload record, check string.
        $this->_recordsTable->deleteTag($exhibit->id, 'tag1');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag3,tag4');

        // Delete `tag4`, reload record, check string.
        $this->_recordsTable->deleteTag($exhibit->id, 'tag4');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag3');

        // Delete `tag3`, reload record, check string.
        $this->_recordsTable->deleteTag($exhibit->id, 'tag3');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, '');

    }


    /**
     * --------------------------------------------------------------------
     * deleteTag() should only update records in the passed exhibit.
     * --------------------------------------------------------------------
     */
    public function testExhibitIsolation()
    {

        // Exhibits.
        $exhibit1 = $this->__exhibit('slug-1');
        $exhibit2 = $this->__exhibit('slug-2');

        // Record 1.
        $record1 = new NeatlineRecord($exhibit1);
        $record1->tags = 'tag';
        $record1->save();

        // Record 2.
        $record2 = new NeatlineRecord($exhibit2);
        $record2->tags = 'tag';
        $record2->save();

        // Update tag, reload records.
        $this->_recordsTable->deleteTag($exhibit1->id, 'tag');
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Record1 updated, record2 unchanged.
        $this->assertEquals($record1->tags, '');
        $this->assertEquals($record2->tags, 'tag');

    }


}
