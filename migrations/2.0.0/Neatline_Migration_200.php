<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_200 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.0.0`.
     */
    public function migrate()
    {
        $this->_backupOldTables();
        $this->_installNewTables();
        $this->_queueMigration();
    }


    /**
     * Migrate exhibits and records to new schema.
     */
    public function migrateData()
    {

        $this->db->beginTransaction();

        try {

            // Migrate the data.
            $this->_moveExhibitsToNewTable();
            $this->_setDefaultBaseLayers();

        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }

    }


    /**
     * Save off unmodified copies of the original tables.
     */
    private function _backupOldTables()
    {
        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            RENAME TO `{$this->_db->prefix}neatline_exhibits_migrate`"
        );
        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_data_records`
            RENAME TO `{$this->_db->prefix}neatline_data_records_migrate`"
        );
        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_base_layers`
            RENAME TO `{$this->_db->prefix}neatline_base_layers_migrate`"
        );
    }


    /**
     * Install the new 2.0.0 schema.
     */
    private function _installNewTables()
    {
        $this->_plugin->hookInstall();
    }


    /**
     * Queue the background process to migrate the data.
     */
    private function _queueMigration()
    {
        Zend_Registry::get('job_dispatcher')->sendLongRunning(
            'Neatline_Job_UpgradeFrom1x', array(
                'web_dir' => nl_getWebDir()
            )
        );
    }


    /**
     * Transfer all exhibit rows from the renamed migration table into the
     * new `neatline_exhibits` table.
     */
    private function _moveExhibitsToNewTable()
    {
        // TODO
    }


    /**
     * Update all of the `base_layer` fields on the new exhibit records
     * with the layer slug that corresponds to the old foreign key.
     */
    private function _setDefaultBaseLayers()
    {
        // TODO
    }


}
