<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `applyStyles` on `NeatlineRecordTable`.
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
     * `applyStyles` should propagate styles to records in the exhibit.
     */
    public function testApplyStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag2';
        $record1->save();
        $record2->save();

        // YAML
        $exhibit->styles = <<<YAML
tag1:
 - vector_color: '1'
 - vector_opacity: 2
tag2:
 - stroke_color: '3'
 - stroke_opacity: 4
YAML;

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
     * `applyStyles` should ignore styles that do not have values.
     */
    public function testIgnoreStylesWithoutValues()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);
        $record->vector_color = 'color';
        $record->tags = 'tag';
        $record->save();

        // YAML
        $exhibit->styles = <<<YAML
tag:
 - vector_color
YAML;

        // Apply styles, reload record.
        $this->_recordsTable->applyStyles($exhibit);
        $record = $this->_recordsTable->find($record->id);

        // `vector_color` should not be changed.
        $this->assertEquals($record->vector_color, 'color');

    }


    /**
     * The `default` tag should be applied to all records in an exhibit.
     */
    public function testDefaultTag()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // YAML
        $exhibit->styles = <<<YAML
default:
 - vector_color: 'color'
YAML;

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Both records should be matched by `default`.
        $this->assertEquals($record1->vector_color, 'color');
        $this->assertEquals($record2->vector_color, 'color');

    }


    /**
     * `applyStyles` should only update records in the passed exhibit.
     */
    public function testExhibitIsolation()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit2);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // YAML
        $exhibit1->styles = <<<YAML
tag:
 - vector_color: '1'
YAML;

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Just exhibit 1 record should be updated.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertNull($record2->vector_color);

    }


    /**
     * When a record is passed, just that record should be updated.
     */
    public function testRecordIsolation()
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
 - vector_color: '1'
YAML;

        // Apply styles, reload records.
        $this->_recordsTable->applyStyles($exhibit, $record1);
        $record1 = $this->_recordsTable->find($record1->id);
        $record2 = $this->_recordsTable->find($record2->id);

        // Just record 1 record should be updated.
        $this->assertEquals($record1->vector_color, '1');
        $this->assertNull($record2->vector_color);

    }


}
