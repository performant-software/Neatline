<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `afterDelete()` on NeatlineTag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTest_AfterDelete
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * When a tag is deleted, it should be removed from all `tags` strings
     * in the records collection.
     * --------------------------------------------------------------------
     */
    public function testDeletePropagation()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag');

        // Create tagged record.
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        // Delete.
        $tag->delete();

        // Reload the record, check updated tags.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, '');

    }


}
