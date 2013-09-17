<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_UpdateSchema extends Neatline_Case_Migrate200
{


    /**
     * The original exhibits, records, and layers tables should be preserved
     * with `_migrate` extensions.
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
     * The new `neatline_exhibits` and `neatline_records` tables with the 2.x
     * schema should be installed.
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


}
