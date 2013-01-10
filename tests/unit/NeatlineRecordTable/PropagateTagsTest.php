<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `propagateTags()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_PropagateTags
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * propagateTags() should:
     *
     * - Explode the `tags` attribute and query for the tags by name.
     *
     * - For each tag, update all records in the exhibit tagged with that
     *   tag such that the "active" attributes on the tag are synchronized
     *   across the entire set of "sibling" records.
     *
     * For example, if records A and B are both tagged with 'tag1', and
     * tag1 is set to control vector_color and stroke_color, then whenever
     * record A is saved, the values of vector_color and stroke_color on
     * record A should be propagated to record B.
     * --------------------------------------------------------------------
     */
    public function testPropagateTags()
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
        $strokeColor->tag = 'stroke';
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

        // Propagate.
        $this->_recordsTable->propagateTags($record1);

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


    /**
     * --------------------------------------------------------------------
     * propagateTags() should only update records in the passed exhibit.
     * --------------------------------------------------------------------
     */
    public function testExhibitIsolation()
    {

        // Exhibits.
        $exhibit1 = $this->__exhibit('slug-1');
        $exhibit2 = $this->__exhibit('slug-2');

        // Tag.
        $tag = new NeatlineTag($exhibit1);
        $tag->tag = 'tag';
        $tag->vector_color = 1;
        $tag->save();

        // Record 1.
        $record1 = new NeatlineRecord($exhibit1);
        $record1->tags = 'tag';
        $record1->save();

        // Record 2.
        $record2 = new NeatlineRecord($exhibit1);
        $record2->tags = 'tag';
        $record2->save();

        // Record 3.
        $record3 = new NeatlineRecord($exhibit2);
        $record3->tags = 'tag';
        $record3->save();

        // Propagate new style.
        $record1->vector_color = 'color';
        $this->_recordsTable->propagateTags($record1);

        // Reload records.
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);

        // Just records in exhibit 1 changed.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');
        $this->assertEquals($record3->vector_color, null);

    }


}
