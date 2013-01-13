<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `syncStyles()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_ApplyStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * applyStyles() should synchronize the tag-siblings of a record to
     * match the values on the passed record.
     */
    public function testApplyStyles()
    {

        $exhibit1 = $this->__exhibit('slug-1');
        $exhibit2 = $this->__exhibit('slug-2');
        $exhibit2->styles = <<<EOD
tag1:
 - vector_color: '1'
 - vector_opacity: 2
 - point_radius

tag2:
 - stroke_color: '3'
 - stroke_opacity: 4
 - stroke_width
EOD;
        $exhibit2->save();

        // `tag1` record.
        $record1 = $this->__record($exhibit2);
        $record1->tags = 'tag1';
        $record1->save();

        // `tag2` record.
        $record2 = $this->__record($exhibit2);
        $record2->tags = 'tag2';
        $record2->save();

        // Record in different exhibit.
        $record3 = $this->__record($exhibit1);
        $record3->tags = 'tag2';
        $record3->save();

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit2);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);

        // `tag1` record styles should be set.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertEquals($record1->vector_opacity, 2);
        $this->assertNull($record1->point_radius);

        // `tag2` record styles should be set.
        $this->assertEquals($record2->stroke_color, '3');
        $this->assertEquals($record2->stroke_opacity, 4);
        $this->assertNull($record2->stroke_width);

        // Exhibit 1 record should be unchanged.
        $this->assertNull($record3->stroke_color);
        $this->assertNull($record3->stroke_opacity);
        $this->assertNull($record3->stroke_width);

    }


}
