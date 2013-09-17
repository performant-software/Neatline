<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitExtantFields
    extends Neatline_Case_Migrate200
{


    /**
     * All values on the old exhibits table that have a direct equivalent on
     * the new table should be migrated directly.
     */
    public function testProcessExhibitExtantFields()
    {

        $this->_loadFixture('Hotchkiss.exhibits');

        $this->_upgrade();
        $this->_migrate();

        $this->_exhibitMigration('id',                  'id');
        $this->_exhibitMigration('name',                'title');
        $this->_exhibitMigration('description',         'narrative');
        $this->_exhibitMigration('slug',                'slug');
        $this->_exhibitMigration('public',              'public');
        $this->_exhibitMigration('query',               'item_query');
        $this->_exhibitMigration('default_map_bounds',  'map_focus');
        $this->_exhibitMigration('default_map_zoom',    'map_zoom');

    }


}
