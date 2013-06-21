<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migration200Test_InstallNewTables extends Neatline_Case_Migration
{


    /**
     * The new `neatline_exhibits` and `neatline_records` tables with the
     * 2.x schema should be installed.
     */
    public function testInstallNewTables()
    {

        $tables = $this->db->listTables();
        $p = "{$this->db->prefix}neatline_";

        $this->assertContains("{$p}exhibits", $tables);
        $this->assertContains("{$p}records", $tables);

        $exhibits = $this->db->describeTable("{$p}exhibits");
        $records = $this->db->describeTable("{$p}records");

        $this->assertArrayHasKey('widgets', $exhibits);
        $this->assertArrayHasKey('widgets', $records);

    }


}
