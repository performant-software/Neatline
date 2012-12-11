<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getOrCreateTag()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_GetOrCreateTag
    extends Neatline_Test_AppTestCase
{


    /**
     * getOrCreateTag() should create a new tag for a record when one does
     * not already exist and set the `tag_id` reference.
     *
     * @group tags
     */
    public function testCreateTag()
    {

        // Create record.
        $record = $this->__record();

        // Get local tag.
        $c1 = $this->_tagsTable->count();
        $tag = $record->getOrCreateTag();
        $c2 = $this->_tagsTable->count();

        // 1 new tag.
        $this->assertEquals($c1+1, $c2);

        // Re-get record, check reference.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tag_id, $tag->id);

    }


    /**
     * getOrCreateTag() should retrieve an existing tag for a record when
     * one already exists.
     *
     * @group tags
     */
    public function testUpdateTag()
    {

        // Create record.
        $record = $this->__record();

        // Create tag record.
        $tag = $this->__tag(null, $record->getExhibit());
        $record->tag_id = $tag->id;
        $record->save();

        // Get local tag.
        $c1 = $this->_tagsTable->count();
        $tag = $record->getOrCreateTag();
        $c2 = $this->_tagsTable->count();

        // No new tag.
        $this->assertEquals($c1, $c2);

        // Check reference.
        $this->assertEquals($record->tag_id, $tag->id);

    }


}
