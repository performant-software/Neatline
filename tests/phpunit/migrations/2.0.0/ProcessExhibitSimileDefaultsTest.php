<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitSimileDefaults
    extends Neatline_Case_Migrate
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessExhibitSimileDefaults.exhibits');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * The `default_focus_date` field should be migrated directly, and default
     * values should be set for the tape and track heights.
     */
    public function testSetExtantFields()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals('2000', $expansion->simile_default_date);
        $this->assertEquals(10,     $expansion->simile_tape_height);
        $this->assertEquals(30,     $expansion->simile_track_height);

    }


    /**
     * If the old `default_timeline_zoom` field is non-null, the new
     * `simile_interval_unit` and `simile_interval_pixels` fields should be
     * set with the values that correspond to the old zoom index.
     */
    public function testSetExistingZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals('HOUR', $expansion->simile_interval_unit);
        $this->assertEquals(300,    $expansion->simile_interval_pixels);

    }


    /**
     * If `default_timeline_zoom` field is null, the default values should be
     * set on the new expansion row.
     */
    public function testSetDefaultZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline No Zoom')
        );

        $this->assertEquals('YEAR', $expansion->simile_interval_unit);
        $this->assertEquals(100,    $expansion->simile_interval_pixels);

    }


}
