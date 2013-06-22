<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_MigrateAllRows extends Neatline_Case_Migrate200
{


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


}
