<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_MigrateSimileDefaults
    extends Neatline_Case_Migrate200
{


    /**
     * The `default_focus_date` from the old exhibit should be migrated
     * directly to the new `simile_default_date`.
     */
    public function testSetDefaultDate()
    {
        // TODO
    }


    /**
     * If the old `default_timeline_zoom` field is non-null, set the new
     * `simile_interval_unit` and `simile_interval_pixels` fields with the
     * values that correspond to the old zoom index.
     */
    public function testMigrateExistingZoom()
    {
        // TODO
    }


    /**
     * If `default_timeline_zoom` field is null, set default values on the
     * new expansion row.
     */
    public function testSetDefaultZoom()
    {
        // TODO
    }


}
