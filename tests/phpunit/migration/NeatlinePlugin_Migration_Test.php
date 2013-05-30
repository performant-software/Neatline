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
     * The titles get transferred correctly.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function testMigrateTitle()
    {
        $db     = $this->db;
        $prefix = "{$db->prefix}neatline_";

        $helper = new Neatline_Helper_Migration(null, $this->db);
        $helper->migrateData();

        $select = $db
            ->select()
            ->from("{$prefix}exhibits_migrate");
        $q      = $select->query();
        $v1     = $q->fetchAll();
        $names1 = array();
        foreach ($v1 as $e) {
            $names1[] = $e['name'];
        }
        sort($names1);

        $select = $db
            ->select()
            ->from("{$prefix}exhibits");
        $q  = $select->query();
        $v2 = $q->fetchAll();
        $names2 = array();
        foreach ($v2 as $e) {
            $names2[] = $e['title'];
        }
        sort($names2);

        $this->assertNotEmpty($names1);
        $this->assertNotEmpty($names2);
        $this->assertEquals($names1, $names2);
    }

}

