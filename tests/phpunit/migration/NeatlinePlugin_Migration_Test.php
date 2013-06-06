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
            ->from("{$prefix}{$table_a}_migrate");
        $q       = $select->query();
        $v1      = $q->fetchAll();
        $values1 = array();
        foreach ($v1 as $e) {
            $values1[] = $e[$a];
        }
        sort($values1);

        $t2 = $db->getTable($table_b);
        $v2 = $t2->findAll();
        $values2 = array();
        foreach ($v2 as $e) {
            $values2[] = $e->$b;
        }
        sort($values2);

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
        $this->_migrate();
        $this->_testRecordMigration('geocoverage', 'coverage');
    }

}

