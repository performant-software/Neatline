<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migrate extends Neatline_Case_Default
{


    static protected $oldVersion = '2.0.2';
    static protected $newVersion = '2.4.3';


    /**
     * Install the old schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_installSchema(self::$oldVersion);
    }


    /**
     * Restore the current schema.
     */
    public function tearDown()
    {
        $this->_installSchema(self::$newVersion);
        parent::tearDown();
    }


    /**
     * Install a schema by version number.
     *
     * @param string $version The version number.
     */
    protected function _installSchema($version)
    {

        // Drop all tables.
        $this->_clearSchema();

        // Install new schema.
        $slug = str_replace(array('.', '-'), '', $version);
        call_user_func("nl_schema$slug");

    }


    /**
     * Drop all Neatline tables.
     */
    protected function _clearSchema()
    {

        // Show all tables in the installation.
        foreach (get_db()->query('SHOW TABLES')->fetchAll() as $row) {

            // Extract the table name.
            $rv    = array_values($row);
            $table = $rv[0];

            // If the table is a Neatline table, drop it.
            if (in_array('neatline', explode('_', $table))) {
                $this->db->query("DROP TABLE $table");
            }

        }

    }


    /**
     * Migration from the old version.
     */
    protected function _upgrade()
    {
        $this->helper->pluginBroker->callHook(
            'upgrade', array('old_version' => self::$oldVersion), 'Neatline'
        );
    }


    /**
     * Load a SQL fixture.
     *
     * @param string $fixture The name of the fixture.
     */
    protected function _loadFixture($fixture)
    {
        $this->db->query(file_get_contents(
            NL_TEST_DIR."/tests/migration/fixtures/$fixture.sql"
        ));
    }


}
