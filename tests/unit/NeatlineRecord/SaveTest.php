<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `save()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Save
    extends Neatline_Test_AppTestCase
{


    /**
     * When save() is called, any NULL style attributes should be pointed
     * at the default tag for the parent exhibit by beforeSave().
     *
     * @group tags
     */
    public function testSetDefaultStyles()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord(null, $exhibit);
        $record->save();

        // Get the exhibit default tag, check references.
        $tag = $this->_tagsTable->getExhibitDefault($exhibit);
        $this->assertEquals($record->vector_color, $tag->id);
        $this->assertEquals($record->stroke_color, $tag->id);
        $this->assertEquals($record->select_color, $tag->id);
        $this->assertEquals($record->vector_opacity, $tag->id);
        $this->assertEquals($record->select_opacity, $tag->id);
        $this->assertEquals($record->stroke_opacity, $tag->id);
        $this->assertEquals($record->image_opacity, $tag->id);
        $this->assertEquals($record->stroke_width, $tag->id);
        $this->assertEquals($record->point_radius, $tag->id);
        $this->assertEquals($record->point_image, $tag->id);
        $this->assertEquals($record->max_zoom, $tag->id);
        $this->assertEquals($record->min_zoom, $tag->id);

    }


    /**
     * save() should update the coverage if a WKT string is passed.
     */
    public function testSetCoverage()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord(null, $exhibit);

        // Set coverage.
        $record->save('GEOMETRYCOLLECTION(
            POLYGON((0 0,0 4,4 4,4 0,0 0)))');

        // Re-get, check for set coverage.
        $record = $this->_recordsTable->find($record->id);
        $this->assertNotNull($record->coverage);

    }


    /**
     * afterSave() should update the modified field on the parent exhibit.
     */
    public function testUpdateParentModified()
    {

        // Get time.
        $timestamp = date('Y-m-d H:i:s');

        // Set the modified date back, get delta and check.
        $exhibit = $this->__exhibit();
        $exhibit->modified = '2010-01-01 00:00:00';
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertGreaterThanOrEqual(1, $delta);

        // Create a record and save.
        $record = new NeatlineRecord(null, $exhibit);
        $record->save();

        // Reget the record.
        $exhibit = $record->getExhibit();

        // Get delta and check.
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertLessThanOrEqual(1, $delta);

    }


}
