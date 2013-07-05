<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordExtantFields
    extends Neatline_Case_Migrate200
{


    /**
     * All values on the old records table that have a direct equivalent
     * on the new table should be migrated directly.
     */
    public function testProcessRecordExtantFields()
    {

        $this->_loadFixture('Hotchkiss.records');

        $this->_upgrade();
        $this->_migrate();

        $this->_recordMigration('id',               'id');
        $this->_recordMigration('exhibit_id',       'exhibit_id');
        $this->_recordMigration('title',            'title');
        $this->_recordMigration('slug',             'slug');
        $this->_recordMigration('start_date',       'start_date');
        $this->_recordMigration('end_date',         'end_date');
        $this->_recordMigration('point_image',      'point_image');
        $this->_recordMigration('display_order',    'weight');
        $this->_recordMigration('map_bounds',       'map_focus');
        $this->_recordMigration('map_zoom',         'map_zoom');

    }


}
