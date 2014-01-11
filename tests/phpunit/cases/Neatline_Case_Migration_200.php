<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migration_200 extends Neatline_Case_Default
{


    /**
     * Install the 1.x schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_create1xSchema();
        $this->_mockTheme();
    }


    /**
     * Restore the 2.x schema.
     */
    public function tearDown()
    {
        $this->_create2xSchema();
        parent::tearDown();
    }


    /**
     * Install the 1.x schema.
     */
    protected function _create1xSchema()
    {
        $this->_clearSchema();
        nl_schema113();
    }


    /**
     * Install the 2.x schema.
     */
    protected function _create2xSchema()
    {
        $this->_clearSchema();
        nl_schema200();
    }


    /**
     * Clear all Neatline tables.
     */
    protected function _clearSchema()
    {

        // Show all tables in the installation.
        foreach ($this->db->query('SHOW TABLES')->fetchAll() as $row) {

            // Extract the raw name.
            $table = array_values($row)[0];

            if (in_array('neatline', explode('_', $table))) {
                $this->db->query("DROP TABLE $table");
            }

        }

    }


    /**
     * Create the `neatline_maps_services` table.
     */
    protected function _createServicesTable()
    {

        $this->db->query(<<<SQL

        CREATE TABLE IF NOT EXISTS {$this->db->prefix}neatline_maps_services (

            id      int(10) unsigned not null auto_increment,
            item_id int(10) unsigned unique,
            address text collate utf8_unicode_ci,
            layers  text collate utf8_unicode_ci,

            PRIMARY KEY (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL
);

    }


    /**
     * Trigger the `upgrade` hook.
     */
    protected function _upgrade()
    {

        // Create plugin manager class.
        $this->helper->pluginBroker->setCurrentPluginDirName('Neatline');
        $this->plugin = new NeatlinePlugin();

        // Upgrade from 1.1.3 -> 2.0.0.
        $this->plugin->hookUpgrade(array(
            'old_version' => '1.1.3',
            'new_version' => '2.0.0'
        ));

    }


    /**
     * Run the migration job.
     */
    protected function _migrate()
    {
        $helper = new Neatline_Migration_200(null, $this->db, false);
        $helper->migrateData();
    }


    /**
     * Load JSON fixtures.
     *
     * @param string $fixture The fixture file.
     */
    protected function _loadFixture($fixture)
    {

        // Load the `$rows`.
        eval(file_get_contents(
            NL_TEST_DIR.'/tests/migrations/2.0.0/fixtures/'.$fixture
        ));

        // Exhibits:
        if (strpos($fixture, 'exhibits')) {
            foreach ($rows as $row) {
                $this->db->insert('NeatlineExhibit', $row);
            }
        }

        // Records:
        if (strpos($fixture, 'records')) {
            foreach ($rows as $row) {
                $this->db->insert('NeatlineDataRecord', $row);
            }
        }

        // Services
        if (strpos($fixture, 'services')) {
            foreach ($rows as $row) {
                $this->db->insert('NeatlineMapsService', $row);
            }
        }

        // Items
        if (strpos($fixture, 'items')) {
            foreach ($rows as $row) {
                $this->db->insert('Item', $row);
            }
        }

        // Texts
        if (strpos($fixture, 'texts')) {
            foreach ($rows as $row) {
                $this->db->insert('ElementText', $row);
            }
        }

        // Files
        if (strpos($fixture, 'files')) {
            foreach ($rows as $row) {
                $this->db->insert('File', $row);
            }
        }

    }


    /**
     * Assert that all values for field A on table X are the same as all
     * values for field B on table Y.
     *
     * @param string $f1
     * @param string $f2
     * @param string $t1
     * @param string $t2
     */
    protected function _migration($f1, $f2, $t1, $t2)
    {

        $sql1 = <<<SQL
        SELECT id, $f1 from {$this->db->prefix}$t1;
SQL;

        $sql2 = <<<SQL
        SELECT id, $f2 from {$this->db->prefix}$t2;
SQL;

        $rows1 = $this->db->query($sql1)->fetchAll();
        $rows2 = $this->db->query($sql2)->fetchAll();

        $values1 = array();
        foreach ($rows1 as $row) $values1[$row['id']] = $row[$f1];

        $values2 = array();
        foreach ($rows2 as $row) $values2[$row['id']] = $row[$f2];

        $this->assertEquals($values2, $values1);

    }


    /**
     * Assert that an exhibit field was migrated to the new table.
     *
     * @param string $f1
     * @param string $f2
     */
    protected function _exhibitMigration($f1, $f2)
    {
        $this->_migration(
            $f1, $f2, 'neatline_exhibits_migrate', 'neatline_exhibits'
        );
    }


    /**
     * Assert that a record field was migrated to the new table.
     *
     * @param string $f1
     * @param string $f2
     */
    protected function _recordMigration($f1, $f2)
    {
        $this->_migration(
            $f1, $f2, 'neatline_data_records_migrate', 'neatline_records'
        );
    }


    /**
     * Fetch an exhibit by `title`.
     *
     * @param string $title
     */
    protected function _getExhibitByTitle($title)
    {
        return $this->_exhibits->findBySql(
            'title=?', array($title), true
        );
    }


    /**
     * Fetch a record by `title`.
     *
     * @param string $title
     */
    protected function _getRecordByTitle($title)
    {
        return $this->_records->findBySql(
            'title=?', array($title), true
        );
    }


    /**
     * Get the SIMILE expansion row that corresponds to an exhibit.
     *
     * @param NeatlineExhibit $exhibit
     */
    protected function _getSimileExpansionByExhibit($exhibit)
    {

        $sql = <<<SQL
        SELECT * FROM
        {$this->db->prefix}neatline_simile_exhibit_expansions
        WHERE parent_id={$exhibit->id};
SQL;


        $q = $this->db->query($sql);
        $q->setFetchMode(Zend_Db::FETCH_OBJ);
        return $q->fetch();

    }


    /**
     * Count the rows in a table.
     *
     * @param string $table
     */
    protected function _countRows($table)
    {
        $sql = <<<SQL
        SELECT COUNT(*) FROM {$this->db->prefix}$table
SQL;
        return $this->db->query($sql)->fetchColumn(0);
    }


}
