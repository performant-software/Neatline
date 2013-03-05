<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `syncStyles` on `NeatlineRecordTable`.
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
     * `syncStyles` should synchronize styles on sibling records.
     */
    public function testSyncStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag1';
        $record3->tags = 'tag2';
        $record1->save();
        $record2->save();
        $record3->save();

        // YAML
        $exhibit->styles = <<<YAML
tag1:
 - vector_color
YAML;

        $exhibit->save();
        $record1->vector_color = 'color';

        // Sync styles, reload records.
        $this->_recordsTable->syncStyles($record1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);

        // Records with `tag1` should be updated.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');

        // Record 3 should be unchanged.
        $this->assertNull($record3->vector_color);

    }


    /**
     * `syncStyles` should ignore styles that have values.
     */
    public function testIgnoreStylesWithValues()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // YAML
        $exhibit->styles = <<<YAML
tag:
 - vector_color: 'color1'
YAML;

        $exhibit->save();
        $record1->vector_color = 'color2';

        // Sync styles, reload records.
        $this->_recordsTable->syncStyles($record1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // `vector_color` should not be updated.
        $this->assertNotEquals($record1->vector_color, 'color2');
        $this->assertNotEquals($record2->vector_color, 'color2');

    }


    /**
     * `syncStyles` should only update records that belong to the exhibit
     * of the passed record.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit1);
        $record3 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record3->tags = 'tag';
        $record1->save();
        $record2->save();
        $record3->save();

        // YAML
        $exhibit1->styles = <<<YAML
tag:
 - vector_color
YAML;

        $exhibit1->save();
        $record1->vector_color = 'color';

        // Apply styles, reload records.
        $this->_recordsTable->syncStyles($record1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);
        $record3 = $this->_recordsTable->find($record3->id);

        // Exhibit 1 records should be updated.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');

        // Exhibit 2 record should be unchanged.
        $this->assertNull($record3->vector_color);

    }


}
