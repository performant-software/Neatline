<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitSimileDefaults
    extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessExhibitSimileDefaults.exhibits');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * The `default_focus_date` field should be migrated directly, and
     * default values should be set for the tape and track heights.
     */
    public function testSetExtantFields()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals($expansion->simile_default_date,    '2000');
        $this->assertEquals($expansion->simile_tape_height,     10);
        $this->assertEquals($expansion->simile_track_height,    30);

    }


    /**
     * If the old `default_timeline_zoom` field is non-null, the new
     * `simile_interval_unit` and `simile_interval_pixels` fields should
     * be set with the values that correspond to the old zoom index.
     */
    public function testSetExistingZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline Zoom')
        );

        $this->assertEquals($expansion->simile_interval_unit,   'HOUR');
        $this->assertEquals($expansion->simile_interval_pixels, 300);

    }


    /**
     * If `default_timeline_zoom` field is null, the default values should
     * be set on the new expansion row.
     */
    public function testSetDefaultZoom()
    {

        $expansion = $this->_getSimileExpansionByExhibit(
            $this->_getExhibitByTitle('Timeline No Zoom')
        );

        $this->assertEquals($expansion->simile_interval_unit,   'YEAR');
        $this->assertEquals($expansion->simile_interval_pixels, 100);

    }


}
