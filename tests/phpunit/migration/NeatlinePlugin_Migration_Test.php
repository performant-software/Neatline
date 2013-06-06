<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlinePlugin_Migration_Test extends NeatlinePlugin_Migration_TestBase
{

    /**
     * This tests that old tables are renamed.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testRenameOldTables()
    {
        $tables = $this->db->listTables();
        $prefix = "{$this->db->prefix}neatline_";
        $this->assertContains("{$prefix}exhibits_migrate",     $tables);
        $this->assertContains("{$prefix}data_records_migrate", $tables);
        $this->assertContains("{$prefix}base_layers_migrate",  $tables);
    }

    /**
     * This tests that new tables are created.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testCreateNewTables()
    {
        $tables = $this->db->listTables();
        $prefix = "{$this->db->prefix}neatline_";
        $this->assertContains("{$prefix}exhibits", $tables);
        $this->assertContains("{$prefix}records",  $tables);
    }

    /**
     * Tests whether the fixtures are working.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testFixtureLoading()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $sql    = "SELECT COUNT(*) AS c FROM {$prefix}exhibits_migrate;";
        $stmt   = $db->query($sql);
        $stmt->setFetchMode(Zend_Db::FETCH_NUM);
        $counts = $stmt->fetchAll();
        $this->assertNotEquals(0, $counts[0][0]);

        $sql    = "SELECT COUNT(*) AS c FROM {$prefix}data_records_migrate;";
        $stmt   = $db->query($sql);
        $stmt->setFetchMode(Zend_Db::FETCH_NUM);
        $counts = $stmt->fetchAll();
        $this->assertNotEquals(0, $counts[0][0]);
    }

    /**
     * Tests whether the background job is started.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testBackgroundJob()
    {
        $db     = $this->db;
        $select = $db
            ->select()
            ->from("{$db->prefix}processes")
            ->where("class='Omeka_Job_Process_Wrapper'")
            ->where("args LIKE '%Neatline_UpgradeJob%'")
            ->where("status='starting'")
            ->where("PID IS NULL")
            ;

        $q    = $select->query();
        $jobs = $q->fetchAll();

        $this->assertGreaterThan(0, $jobs);
    }

    /**
     * This triggers the migration.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _migrate()
    {
        $helper = new Neatline_Helper_Migration(null, $this->db);
        $helper->migrateData();
    }

    /**
     * This tests whether a field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testMigration($table_a, $a, $table_b, $b)
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[$e['id']] = $e[$a];
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[$e->id] = $e->$b;
        }

        $this->assertNotEmpty($values1);
        $this->assertNotEmpty($values2);
        $this->assertEquals($values1, $values2);
    }

    /**
     * This tests whether an exhibit field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testExhibitMigration($a, $b)
    {
        $this->_testMigration('exhibits', $a, 'NeatlineExhibit', $b);
    }

    /**
     * This tests whether a record field was transfered correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _testRecordMigration($a, $b)
    {
        $this->_testMigration('data_records', $a, 'NeatlineRecord', $b);
    }

    /**
     * This tests whether the migration handles all data items.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateCounts()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $this->_migrate();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}exhibits_migrate;");
        $c_old = $q->fetch();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}exhibits;");
        $c_new = $q->fetch();

        $this->assertEquals($c_old['COUNT(*)'], $c_new['COUNT(*)']);
        $this->assertGreaterThan(0, $c_old['COUNT(*)']);
        $this->assertGreaterThan(0, $c_new['COUNT(*)']);

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}data_records_migrate;");
        $c_old = $q->fetch();

        $q     = $db->query("SELECT COUNT(*) FROM {$prefix}records;");
        $c_new = $q->fetch();

        $this->assertEquals($c_old['COUNT(*)'], $c_new['COUNT(*)']);
        $this->assertGreaterThan(0, $c_old['COUNT(*)']);
        $this->assertGreaterThan(0, $c_new['COUNT(*)']);
    }

    /**
     * This tests that simply transfered fields are handled correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateExhibitSimpleTransfers()
    {
        $this->_migrate();
        $this->_testExhibitMigration('id',                 'id');
        $this->_testExhibitMigration('name',               'title');
        $this->_testExhibitMigration('slug',               'slug');
        $this->_testExhibitMigration('public',             'public');
        $this->_testExhibitMigration('description',        'narrative');
        $this->_testExhibitMigration('modified',           'modified');
        $this->_testExhibitMigration('query',              'query');
        $this->_testExhibitMigration('default_map_bounds', 'map_focus');
        $this->_testExhibitMigration('default_map_zoom',   'map_zoom');
    }

    /**
     * This tests that simply transfered data record fields are handled
     * correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateDataRecordSimpleTransfers()
    {
        $this->_migrate();
        $this->_testRecordMigration('id', 'id');
    }

    /**
     * This tests whether the coverage field is correctly handled.
     *
     * @return void
     * @author Eric Rochester
     **/
    function testMigrateDataRecordCoverage()
    {
        $db      = $this->db;
        $prefix  = "{$db->prefix}neatline_";
        $table_a = 'data_records';
        $table_b = 'NeatlineRecord';
        $a       = 'geocoverage';
        $b       = 'coverage';

        $this->_migrate();

        $select = $db
            ->select()
            ->from("{$prefix}{$table_a}_migrate", array('id', $a));
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $value = $e[$a];
            $parts = explode('|', $value);
            if (count($parts) > 1) {
                $value = 'GEOMETRYCOLLECTION(' . implode(',', $parts) . ')';
            }
            $values1[$e['id']] = $value;
        }

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[$e->id] = $e->$b;
        }

        $this->assertNotEmpty($values1);
        $this->assertNotEmpty($values2);
        $this->assertEquals($values1, $values2);
    }

    function testMigrateDataRowCoverageKML()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";
        $tname  = $prefix . "data_records_migrate";
        $sql    = "SELECT COUNT(*) FROM $tname;";
        $insert = <<<SQL
INSERT INTO $tname
    (id, item_id, use_dc_metadata, exhibit_id, parent_record_id, show_bubble,
        title, slug, description, start_date, end_date, start_visible_date,
        end_visible_date, geocoverage, left_percent, right_percent, vector_color,
        stroke_color, highlight_color, vector_opacity, select_opacity, stroke_opacity,
        graphic_opacity, stroke_width, point_radius, point_image, space_active,
        time_active, items_active, display_order, map_bounds, map_zoom)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
SQL;

        $db->delete($tname);
        $this->assertEquals(0, $db->fetchOne($sql));

        $db->query(
            $insert,
            array(
                1,
                null,
                null,
                1,
                null,
                0,
                'A title',
                null,
                'Some descriptive text.',
                '2013-01-01',
                '2013-12-31',
                null,
                null,
                '<kml xmlns="http://earth.google.com/kml/2.0"><Folder><name>OpenLayers export</name><description>Exported on Tue May 21 2013 14:18:48 GMT-0400 (EDT)</description><Placemark><name>OpenLayers.Feature.Vector_294</name><description>No description available</description><Polygon><outerBoundaryIs><LinearRing><coordinates>-10722123.575577,5383403.6586166 -10746583.424625,5275780.3228061 -10643852.058624,4952910.3153745 -10174222.956905,4962694.2549936 -10130195.228619,5065425.6209946 -10076383.560714,5119237.2888999 -10032355.832428,5207292.7454721 -10159547.047477,5295348.2020444 -10159547.047477,5383403.6586166 -10722123.575577,5383403.6586166</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Folder></kml>',
                0,
                100,
                '#ff1971',
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                1,
                1,
                1,
                null,
                '-9748621.5834729, 4808597.2059922',
                5
            ));
        $db->query(
            $insert,
            array(
                2,
                null,
                null,
                1,
                null,
                0,
                'Another title',
                null,
                'Something else descriptive',
                '2012-08-01',
                '2013-04-01',
                '2012-08-01',
                '2013-04-01',
                '<kml xmlns="http://earth.google.com/kml/2.0"><Folder><name>OpenLayers export</name><description>Exported on Tue May 21 2013 14:18:48 GMT-0400 (EDT)</description><Placemark><name>OpenLayers.Feature.Vector_734</name><description>No description available</description><Point><coordinates>-8736595.329118,4583260.8466388</coordinates></Point></Placemark></Folder></kml>',
                13,
                87,
                null,
                null,
                null,
                80,
                null,
                null,
                null,
                null,
                10,
                null,
                1,
                1,
                1,
                null,
                null,
                null,
            ));

        $this->assertEquals(2, $db->fetchOne($sql));

        $this->_migrate();

        $table = $db->getTable('NeatlineRecord');
        $recs  = $table->findAll();

        $this->assertCount(2, $recs);

        foreach ($recs as $r) {
            if ($r->id == 1) {
                $this->assertEquals(
                    'POLYGON((-10722123.575577 5383403.6586166,-10746583.424625 5275780.3228061,-10643852.058624 4952910.3153745,-10174222.956905 4962694.2549936,-10130195.228619 5065425.6209946,-10076383.560714 5119237.2888999,-10032355.832428 5207292.7454721,-10159547.047477 5295348.2020444,-10159547.047477 5383403.6586166,-10722123.575577 5383403.6586166))',
                    $r->coverage
                );

            } else if ($r->id == 2) {
                $this->assertEquals(
                    'POINT(-8736595.329118 4583260.8466388)',
                    $r->coverage
                );

            } else {
                $this->assertTrue(false, 'Invalid ID #.');
            }
        }

    }

}

