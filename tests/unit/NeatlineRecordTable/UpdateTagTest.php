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

        // Update left-hand tag.
        $this->_recordsTable->updateTag($exhibit, 'tag1', 'tag1NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2,tag3');

        // Update interior tag.
        $this->_recordsTable->updateTag($exhibit, 'tag2', 'tag2NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2NEW,tag3');

        // Update right-hand tag.
        $this->_recordsTable->updateTag($exhibit, 'tag3', 'tag3NEW');
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag1NEW,tag2NEW,tag3NEW');

    }


    /**
     * --------------------------------------------------------------------
     * updateTag() should only update records in the passed exhibit.
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
        $this->_recordsTable->updateTag($exhibit1, 'tag', 'tagNEW');
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Record1 updated, record2 unchanged.
        $this->assertEquals($record1->tags, 'tagNEW');
        $this->assertEquals($record2->tags, 'tag');

    }


}
