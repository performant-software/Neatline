<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `applyStyles()` on NeatlineRecordTable.
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
     * applyStyles() should propagate styles to records in the exhibit.
     */
    public function testApplyStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record1->save();
        $record2 = new NeatlineRecord($exhibit);
        $record2->tags = 'tag2';
        $record2->save();

        // Set styles YAML.
        $exhibit->styles = <<<EOD
tag1:
 - vector_color: '1'
 - vector_opacity: 2
tag2:
 - stroke_color: '3'
 - stroke_opacity: 4
EOD;

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Record 1 should have `tag1` styles.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertEquals($record1->vector_opacity, 2);
        $this->assertNull($record1->stroke_color);
        $this->assertNull($record1->stroke_opacity);

        // Record 2 should have `tag2` styles.
        $this->assertEquals($record2->stroke_color, '3');
        $this->assertEquals($record2->stroke_opacity, 4);
        $this->assertNull($record2->vector_color);
        $this->assertNull($record2->vector_opacity);

    }


    /**
     * applyStyles() should only update records in the passed exhibit.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record1->tags = 'tag1';
        $record1->save();
        $record2 = new NeatlineRecord($exhibit2);
        $record2->tags = 'tag1';
        $record2->save();

        // Set styles YAML.
        $exhibit1->styles = <<<EOD
tag1:
 - vector_color: '1'
EOD;

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Just exhibit 1 record should be updated.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertNull($record2->vector_color);

    }


}
