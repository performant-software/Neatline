<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `saveForm()` on NeatlineTag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTest_SaveForm
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * saveForm() should set field values.
     * --------------------------------------------------------------------
     */
    public function testFieldUpdate()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag1');

        // Save with new data.
        $data = array('tag' => 'tag2');
        foreach (neatline_getStyleCols() as $s) $data[$s] = 1;
        $tag->saveForm($data);

        // Check updated fields.
        $this->assertEquals($tag->tag, 'tag2');
        foreach (neatline_getStyleCols() as $s) {
            $this->assertEquals($tag->$s, 1);
        }

    }


    /**
     * --------------------------------------------------------------------
     * When an updated tag name is passed to saveForm(), the tag should be
     * updated in the `tags` column on all tagged records.
     * --------------------------------------------------------------------
     */
    public function testRecordsPropagation()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag1');

        // Create tagged record.
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        // Save with new name.
        $data = array('tag' => 'tag2');
        $tag->saveForm($data);

        // Reload the record, check updated tags.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->tags, 'tag2');

    }


}
