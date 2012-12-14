<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `save()`, `beforeSave()`, `afterSave()`, and `delete()` on
 * NeatlineExhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_SaveDeleteHooks
    extends Neatline_Test_AppTestCase
{


    /**
     * beforeSave() should set `added` and `modified` when the record has
     * not been saved before (when it is being inserted).
     */
    public function testBeforeInsertTimestamps()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'test';
        $exhibit->save();

        // Check for non-null timestamps.
        $this->assertNotNull($exhibit->modified);
        $this->assertNotNull($exhibit->added);

    }


    /**
     * beforeSave() should just set `modified` when the record has already
     * been saved (when it is being updated).
     */
    public function testBeforeSaveTimestamps()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();
        $exhibit->modified = '2000-01-01';
        $exhibit->added = '2000-01-01';
        $exhibit->save();

        // Changed `modified`, unchanged `added`.
        $this->assertNotEquals($exhibit->modified, '2000-01-01');
        $this->assertEquals($exhibit->added, '2000-01-01');

    }


    /**
     * save() should create a default style tag for the exhibit with
     * values drawn from the system defaults when the exhibit is inserted
     * and set the `tag_id` reference to point to the new tag.
     *
     * @group tags
     */
    public function testInsertCreateDefaultTag()
    {

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'test';
        $exhibit->save();

        // Check +1 tags.
        $this->assertEquals($startCount+1, $this->_tagsTable->count());
        $tag = $this->getLastTag();

        // Check reference.
        $this->assertEquals($exhibit->tag_id, $tag->id);

    }


    /**
     * save() should only create a default style tag for the exhibit when
     * the exhibit is inserted, not when it is re-saved.
     *
     * @group tags
     */
    public function testSaveDefaultTagNonDuplication()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'test';
        $exhibit->save();

        // Starting tags count.
        $startCount = $this->_tagsTable->count();
        $exhibit->save();

        // Check +0 tags.
        $this->assertEquals($startCount, $this->_tagsTable->count());

    }


    /**
     * The delete() method should delete the exhibit record and all child
     * data records.
     */
    public function testDelete()
    {

        // Create exhibits and items.
        $neatline1 = $this->__exhibit('test-exhibit-1');
        $neatline2 = $this->__exhibit('test-exhibit-2');
        $item1 = $this->__item();
        $item2 = $this->__item();

        // Create records.
        $record1 = new NeatlineRecord($neatline1, $item1);
        $record2 = new NeatlineRecord($neatline1, $item2);
        $record3 = new NeatlineRecord($neatline2, $item3);
        $record4 = new NeatlineRecord($neatline2, $item4);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // 2 exhibits, 4 data records.
        $_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $_recordsTable = $this->db->getTable('NeatlineRecord');
        $this->assertEquals($_exhibitsTable->count(), 2);
        $this->assertEquals($_recordsTable->count(), 4);

        // Call delete.
        $neatline1->delete();

        // 1 exhibits, 2 data records.
        $this->assertEquals($_exhibitsTable->count(), 1);
        $this->assertEquals($_recordsTable->count(), 2);

    }


}
