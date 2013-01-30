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
     * syncStyles() should synchronize styles on sibling records.
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
        $exhibit->styles = "
        tag1:
         - vector_color
        ";

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
     * syncStyles() should ignore styles that have values.
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
        $exhibit->styles = "
        tag:
         - vector_color: 'color1'
        ";

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
     * When the `all` style is defined, all styles should be synced.
     */
    public function testSyncAllStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // YAML
        $exhibit->styles = "
        tag:
         - all
        ";

        $exhibit->save();

        // Define all styles.
        $record1->vector_color      = '1';
        $record1->stroke_color      = '2';
        $record1->select_color      = '3';
        $record1->point_image       = '4';
        $record1->vector_opacity    = 5;
        $record1->select_opacity    = 6;
        $record1->stroke_opacity    = 7;
        $record1->image_opacity     = 8;
        $record1->stroke_width      = 9;
        $record1->point_radius      = 10;
        $record1->max_zoom          = 11;
        $record1->min_zoom          = 12;
        $record1->map_focus         = 13;
        $record1->map_zoom          = 14;

        // Sync styles, reload record 2.
        $this->_recordsTable->syncStyles($record1);
        $record2 = $this->_recordsTable->find($record2->id);

        // All styles should be propagated.
        $this->assertEquals($record2->vector_color,     '1');
        $this->assertEquals($record2->stroke_color,     '2');
        $this->assertEquals($record2->select_color,     '3');
        $this->assertEquals($record2->point_image,      '4');
        $this->assertEquals($record2->vector_opacity,   5);
        $this->assertEquals($record2->select_opacity,   6);
        $this->assertEquals($record2->stroke_opacity,   7);
        $this->assertEquals($record2->image_opacity,    8);
        $this->assertEquals($record2->stroke_width,     9);
        $this->assertEquals($record2->point_radius,     10);
        $this->assertEquals($record2->max_zoom,         11);
        $this->assertEquals($record2->min_zoom,         12);
        $this->assertEquals($record2->map_focus,        13);
        $this->assertEquals($record2->map_zoom,         14);

    }


    /**
     * syncStyles() should only update records that belong to the exhibit
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
        $exhibit1->styles = "
        tag:
         - vector_color
        ";

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
