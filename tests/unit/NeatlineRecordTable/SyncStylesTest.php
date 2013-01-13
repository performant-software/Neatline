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

class Neatline_NeatlineRecordTableTest_SyncStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * syncStyles() should synchronize the tag-siblings of a record to
     * match the values on the passed record.
     */
    public function testSyncStyles()
    {

        $exhibit1 = $this->__exhibit('slug-1');
        $exhibit2 = $this->__exhibit('slug-2');
        $exhibit2->styles = <<<EOD

tag1:
 - vector_color: '1'
 - vector_opacity

tag2:
 - stroke_color: '2'
 - stroke_opacity

EOD;

        $exhibit2->save();

        // `tag1` and `tag2` record.
        $record1 = $this->__record($exhibit2);
        $record1->tags = 'tag1, tag2';
        $record1->vector_color = '3';
        $record1->vector_opacity = 4;
        $record1->stroke_color = '5';
        $record1->stroke_opacity = 6;
        $record1->save();

        // `tag1` record.
        $record2 = $this->__record($exhibit2);
        $record2->tags = 'tag1';
        $record2->save();

        // `tag2` record.
        $record3 = $this->__record($exhibit2);
        $record3->tags = 'tag2';
        $record3->save();

        // Record in different exhibit.
        $record4 = $this->__record($exhibit1);
        $record4->tags = 'tag1';
        $record4->save();

        // Sync styles, reload records.
        $this->_recordsTable->syncStyles($record1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);
        $record4 = $this->_recordsTable->find($record4->id);

        // `tag1` record styles should be set.
        $this->assertEquals($record2->vector_opacity, 4);
        $this->assertNull($record2->vector_color);

        // `tag2` record styles should be set.
        $this->assertEquals($record3->stroke_opacity, 6);
        $this->assertNull($record3->stroke_color);

        // Exhibit 1 record should be unchanged.
        $this->assertNull($record3->vector_opacity);

    }


}
