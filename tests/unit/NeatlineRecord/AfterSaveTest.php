<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `afterSave()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_AfterSave
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * When a record is saved, all records that share a tag with the saved
     * record should be updated so that the fields managed by the common
     * tag are set to match the values of the record being saved. This has
     * the effect of propagating the settings on the saved record across
     * all of its "siblings," as defined by the taggings.
     * --------------------------------------------------------------------
     */
    public function testTagUpdate()
    {

        // Create two exhibits.
        $exhibit = $this->__exhibit();

        // Vector color tag.
        $vectorColor = new NeatlineTag($exhibit);
        $vectorColor->tag = 'vector';
        $vectorColor->vector_color = 1;
        $vectorColor->save();

        // Stroke color tag.
        $strokeColor = new NeatlineTag($exhibit);
        $vectorColor->tag = 'stroke';
        $strokeColor->stroke_color = 1;
        $strokeColor->save();

        // Tagged with `vector` and `stroke`.
        $record1 = new NeatlineRecord($exhibit);
        $record1->tags = 'vector,stroke';
        $record1->save();

        // Tagged with just `vector`.
        $record2 = new NeatlineRecord($exhibit);
        $record2->tags = 'vector';
        $record2->save();

        // Tagged with just `stroke`.
        $record3 = new NeatlineRecord($exhibit);
        $record3->tags = 'stroke';
        $record3->save();

        // Save new vales.
        $record1->vector_color = 'vector';
        $record1->stroke_color = 'stroke';
        $record1->save();

        // Reload records.
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);

        // Check `vector_color` propagation.
        $this->assertEquals($record1->vector_color, 'vector');
        $this->assertEquals($record2->vector_color, 'vector');
        $this->assertEquals($record3->vector_color, null);

        // Check `stroke_color` propagation.
        $this->assertEquals($record1->stroke_color, 'stroke');
        $this->assertEquals($record2->stroke_color, null);
        $this->assertEquals($record3->stroke_color, 'stroke');

    }


}
