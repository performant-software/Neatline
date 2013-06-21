<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test extends Neatline_Case_Migrate200
{


    /**
     * The original exhibits, records, and base layers tables should be
     * preserved with `_migrate` extensions.
     */
    public function testBackupOldTables()
    {

        $this->_upgrade();

        $tables = $this->db->listTables();
        $p = "{$this->db->prefix}neatline_";

        $this->assertContains("{$p}exhibits_migrate", $tables);
        $this->assertContains("{$p}data_records_migrate", $tables);
        $this->assertContains("{$p}base_layers_migrate", $tables);

    }


    /**
     * The new `neatline_exhibits` and `neatline_records` tables with the
     * 2.x schema should be installed.
     */
    public function testInstallNewTables()
    {

        $this->_upgrade();

        $tables = $this->db->listTables();
        $p = "{$this->db->prefix}neatline_";

        $this->assertContains("{$p}exhibits", $tables);
        $this->assertContains("{$p}simile_exhibit_expansions", $tables);
        $this->assertContains("{$p}records", $tables);

        $exhibits = $this->db->describeTable("{$p}exhibits");
        $records  = $this->db->describeTable("{$p}records");

        $this->assertArrayHasKey('widgets', $exhibits);
        $this->assertArrayHasKey('widgets', $records);

    }


    /**
     * When the plugin is upgraded, the background process to migrate the
     * data should be added to the queue.
     */
    public function testStartBackgroundJob()
    {

        $this->_upgrade();

        $jobs = $this->db->select()
            ->from("{$this->db->prefix}processes")
            ->where("class='Omeka_Job_Process_Wrapper'")
            ->where("args LIKE '%Neatline_Job_UpgradeFrom1x%'")
            ->where("status='starting'")
            ->where("PID IS NULL")
            ->query()->fetchAll();

        $this->assertNotEmpty($jobs);

    }


    /**
     * All exhibit rows should be migrated into the new table.
     */
    public function testMigrateAllExhibits()
    {

        $this->_loadFixture('Hotchkiss.exhibits.json');

        $this->_upgrade();
        $this->_migrate();

        $c1sql = <<<SQL
        SELECT COUNT(*) FROM
        {$this->db->prefix}neatline_exhibits_migrate
SQL;

        $c2sql = <<<SQL
        SELECT COUNT(*) FROM
        {$this->db->prefix}neatline_exhibits
SQL;

        $c1 = $this->db->query($c1sql)->fetch();
        $c2 = $this->db->query($c2sql)->fetch();

        $this->assertEquals($c1, $c2);

    }


    /**
     * All record rows should be migrated into the new table.
     */
    public function testMigrateAllRecords()
    {

        $this->_loadFixture('Hotchkiss.records.json');

        $this->_upgrade();
        $this->_migrate();

        $c1sql = <<<SQL
        SELECT COUNT(*) FROM
        {$this->db->prefix}neatline_data_records_migrate
SQL;

        $c2sql = <<<SQL
        SELECT COUNT(*) FROM
        {$this->db->prefix}neatline_records
SQL;

        $c1 = $this->db->query($c1sql)->fetch();
        $c2 = $this->db->query($c2sql)->fetch();

        $this->assertEquals($c1, $c2);

    }


    /**
     * The old `default_base_layer` foreign key references should be moved
     * to the corresponding layer slugs in the new `base_layers` field.
     */
    public function testSetDefaultBaseLayers()
    {

        $this->_loadFixture('SetDefaultBaseLayers.exhibits.json');

        $this->_upgrade();
        $this->_migrate();

        // ----------------------------------------------------------------

        $OpenStreetMap = $this->__exhibits->findBySql(
            'title=?', array('OpenStreetMap'), true
        );
        $this->assertEquals(
            $OpenStreetMap->base_layer, 'OpenStreetMap'
        );

        // ----------------------------------------------------------------

        $GooglePhysical = $this->__exhibits->findBySql(
            'title=?', array('GooglePhysical'), true
        );
        $this->assertEquals(
            $GooglePhysical->base_layer, 'GooglePhysical'
        );

        // ----------------------------------------------------------------

        $GoogleStreets = $this->__exhibits->findBySql(
            'title=?', array('GoogleStreets'), true
        );
        $this->assertEquals(
            $GoogleStreets->base_layer, 'GoogleStreets'
        );

        // ----------------------------------------------------------------

        $GoogleHybrid = $this->__exhibits->findBySql(
            'title=?', array('GoogleHybrid'), true
        );
        $this->assertEquals(
            $GoogleHybrid->base_layer, 'GoogleHybrid'
        );

        // ----------------------------------------------------------------

        $GoogleSatellite = $this->__exhibits->findBySql(
            'title=?', array('GoogleSatellite'), true
        );
        $this->assertEquals(
            $GoogleSatellite->base_layer, 'GoogleSatellite'
        );

        // ----------------------------------------------------------------

        $StamenWatercolor = $this->__exhibits->findBySql(
            'title=?', array('StamenWatercolor'), true
        );
        $this->assertEquals(
            $StamenWatercolor->base_layer, 'StamenWatercolor'
        );

        // ----------------------------------------------------------------

        $StamenToner = $this->__exhibits->findBySql(
            'title=?', array('StamenToner'), true
        );
        $this->assertEquals(
            $StamenToner->base_layer, 'StamenToner'
        );

        // ----------------------------------------------------------------

        $StamenTerrain = $this->__exhibits->findBySql(
            'title=?', array('StamenTerrain'), true
        );
        $this->assertEquals(
            $StamenTerrain->base_layer, 'StamenTerrain'
        );

        // ----------------------------------------------------------------

    }


    /**
     * All values on the old exhibits table that have a direct equivalent
     * on the new table should be migrated directly.
     */
    public function testMigrateExtantExhibitFields()
    {

        $this->_loadFixture('Hotchkiss.exhibits.json');

        $this->_upgrade();
        $this->_migrate();

        $this->_exhibitMigration('id',                  'id');
        $this->_exhibitMigration('modified',            'modified');
        $this->_exhibitMigration('name',                'title');
        $this->_exhibitMigration('description',         'narrative');
        $this->_exhibitMigration('slug',                'slug');
        $this->_exhibitMigration('public',              'public');
        $this->_exhibitMigration('query',               'query');
        $this->_exhibitMigration('default_map_bounds',  'map_focus');
        $this->_exhibitMigration('default_map_zoom',    'map_zoom');

    }


    /**
     * All values on the old records table that have a direct equivalent
     * on the new table should be migrated directly.
     */
    public function testMigrateExtantRecordFields()
    {

        $this->_loadFixture('Hotchkiss.records.json');

        $this->_upgrade();
        $this->_migrate();

        $this->_recordMigration('id',                   'id');
        $this->_recordMigration('exhibit_id',           'exhibit_id');
        $this->_recordMigration('title',                'title');
        $this->_recordMigration('slug',                 'slug');
        $this->_recordMigration('start_date',           'start_date');
        $this->_recordMigration('end_date',             'end_date');
        $this->_recordMigration('start_visible_date',   'after_date');
        $this->_recordMigration('end_visible_date',     'before_date');
        $this->_recordMigration('point_image',          'point_image');
        $this->_recordMigration('display_order',        'weight');
        $this->_recordMigration('map_bounds',           'map_focus');
        $this->_recordMigration('map_zoom',             'map_zoom');

    }


}
