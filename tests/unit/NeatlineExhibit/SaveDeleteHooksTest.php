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

        // Create two exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create records.
        $record1 = $this->__record($exhibit1);
        $record2 = $this->__record($exhibit1);
        $record3 = $this->__record($exhibit2);
        $record4 = $this->__record($exhibit2);

        // Delete exhibit.
        $exhibit1->delete();

        // 1 exhibits, 2 data records.
        $this->assertEquals($this->_exhibitsTable->count(), 1);
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Check unmodified exhibit 2 records.
        $this->assertNotNull($this->_recordsTable->find($record3->id));
        $this->assertNotNull($this->_recordsTable->find($record4->id));

    }


}
