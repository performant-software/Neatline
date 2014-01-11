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


    protected $oldVersion = '2.0.2';
    protected $newVersion = '2.2.0';


    /**
     * Install the old schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_installOldSchema();
    }


    /**
     * Restore the new schema.
     */
    public function tearDown()
    {
        $this->_installNewSchema();
        parent::tearDown();
    }


    /**
     * Install a schema by version number.
     *
     * @param string $version The version number.
     */
    public function _installSchema($version)
    {
        $slug = str_replace('.', '', $version);
        call_user_func("nl_schema$slug");
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
     * Install the previous schema.
     */
    public function _installOldSchema()
    {
        $this->_clearSchema();
        $this->_installSchema(self::$oldVersion);
    }


    /**
     * Install the current schema.
     */
    public function _installNewSchema()
    {
        $this->_clearSchema();
        $this->_installSchema(self::$newVersion);
    }


    /**
     * Trigger the `upgrade` hook.
     */
    protected function _upgrade()
    {

        // Create plugin manager class.
        $this->helper->pluginBroker->setCurrentPluginDirName('Neatline');
        $plugin = new NeatlinePlugin();

        // Upgrade from 1.1.3 -> 2.0.0.
        $plugin->hookUpgrade(array(
            'old_version' => self::$oldVersion,
            'new_version' => self::$newVersion
        ));

    }


    /**
     * Fetch an exhibit by `title`.
     *
     * @param string $title
     */
    protected function _getExhibitByTitle($title)
    {
        return $this->_exhibits->findBySql('title=?', array($title), true);
    }


    /**
     * Fetch a record by `title`.
     *
     * @param string $title
     */
    protected function _getRecordByTitle($title)
    {
        return $this->_records->findBySql('title=?', array($title), true);
    }


}
