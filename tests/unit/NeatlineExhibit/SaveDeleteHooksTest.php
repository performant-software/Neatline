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
     * --------------------------------------------------------------------
     * An exhibit default tag should only be created when a new exhibit is
     * inserted, not when an existing exhibit is saved.
     * --------------------------------------------------------------------
     */
    public function testSaveDefaultTagNonDuplication()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Re-save.
        $c1 = $this->_tagsTable->count();
        $exhibit->save();
        $c2 = $this->_tagsTable->count();

        // Check +0 tags.
        $this->assertEquals($c1, $c2);

    }


    /**
     * --------------------------------------------------------------------
     * delete() should delete the exhibit record and all child records.
     * --------------------------------------------------------------------
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

        // 1 exhibit, 2 records.
        $this->assertEquals($this->_exhibitsTable->count(), 1);
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Check unmodified exhibit 2 records.
        $this->assertNotNull($this->_recordsTable->find($record3->id));
        $this->assertNotNull($this->_recordsTable->find($record4->id));

    }


}
