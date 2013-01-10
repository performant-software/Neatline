<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for DELETE action in tag API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagControllerTest_Delete
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * DELETE should remove a tag.
     * --------------------------------------------------------------------
     */
    public function testDelete()
    {

        // Create exhibit and tags.
        $exhibit = $this->__exhibit();
        $tag1 = $this->__tag($exhibit, 'tag1');
        $tag2 = $this->__tag($exhibit, 'tag2');

        // Hit /tag with DELETE.
        $c1 = $this->_tagsTable->count();
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/tag/'.$tag2->id);
        $c2 = $this->_tagsTable->count();

        // Check code.
        $this->assertResponseCode(200);

        // Check record deleted.
        $this->assertNull($this->_tagsTable->find($tag2->id));
        $this->assertNotNull($this->_tagsTable->find($tag1->id));
        $this->assertEquals($c2, $c1-1);

    }


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
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/tag/'.$tag->id);

        // Reload the record, check updated tags.
        $record = $this->_recordsTable->find($record->id);
        $this->assertNull($record->tags);

    }


}
