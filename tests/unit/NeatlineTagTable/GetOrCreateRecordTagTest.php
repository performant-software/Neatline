<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getOrCreateRecordTag()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_GetOrCreateRecordTag
    extends Neatline_Test_AppTestCase
{


    /**
     * getOrCreateRecordTag() should fetch the local, record-specific tag
     * for a record when one exists. 
     *
     * @group tags
     */
    public function testGetOrCreateRecordTagWhenTagExists()
    {

        // Create record and tag.
        $record = $this->__record();
        $tag = $this->__tag();

        // Set the tag key.
        $record->tag_id = $tag->id;
        $record->save();

        // Get record tag.
        $retrieved = $this->_tagsTable->getOrCreateRecordTag($record);
        $this->assertEquals($retrieved->id, $tag->id);

    }


    /**
     * getOrCreateRecordTag() should return a new, unsaved instance of
     * `NeatlineTag` when a record-specific tag does not exist.
     *
     * @group tags
     */
    public function testGetOrCreateRecordTagWhenTagDoesNotExist()
    {

        // Create record and tag.
        $record = $this->__record();

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Get tag, check for no new insert.
        $retrieved = $this->_tagsTable->getOrCreateRecordTag($record);
        $this->assertEquals($startCount, $this->_tagsTable->count());

        // Should return unsaved NeatlineTag.
        $this->assertInstanceOf('NeatlineTag', $retrieved);
        $this->assertNull($retrieved->id);

    }


}
