<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migrate extends Neatline_Case_Default
{


    static protected $oldVersion = '2.0.2';
    static protected $newVersion = '2.2.0';


    /**
     * Install the old schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_installSchema(self::$oldVersion);
    }


    /**
     * Reinstall the current schema.
     */
    public function tearDown()
    {
        $this->_installSchema(self::$newVersion);
        parent::tearDown();
    }


    /**
     * Drop all Neatline tables.
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
     * Install a schema by version number.
     *
     * @param string $version The version number.
     */
    public function _installSchema($version)
    {
        $this->_clearSchema();
        $slug = str_replace('.', '', $version);
        call_user_func("nl_schema$slug");
    }


    /**
     * Migration from the old version.
     */
    protected function _upgrade()
    {
        $args = array('old_version' => self::$oldVersion);
        $this->helper->pluginBroker->callHook('upgrade', $args, 'Neatline');
    }


    /**
     * Load a SQL fixture.
     *
     * @param string $fixture The name of the fixture.
     */
    public function _loadFixture($fixture)
    {
        $this->db->query(file_get_contents(
            NL_TEST_DIR."/tests/migration/fixtures/$fixture.sql"
        ));
    }


    /**
     * Fetch a record by `slug`.
     *
     * @param string $title
     */
    protected function _getRecordBySlug($slug)
    {
        return $this->_records->findBySql('slug=?', array($slug), true);
    }


}
