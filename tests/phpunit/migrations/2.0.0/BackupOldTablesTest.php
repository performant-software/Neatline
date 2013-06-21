<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_BackupOldTables extends Neatline_Case_Migrate200
{


    /**
     * The original exhibits, records, and base layers tables should be
     * preserved with `_migrate` extensions.
     */
    public function testBackupOldTables()
    {

        $tables = $this->db->listTables();
        $p = "{$this->db->prefix}neatline_";

        $this->assertContains("{$p}exhibits_migrate", $tables);
        $this->assertContains("{$p}data_records_migrate", $tables);
        $this->assertContains("{$p}base_layers_migrate", $tables);

    }


}
