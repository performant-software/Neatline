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

        $this->_db->beginTransaction();

        try {

            // MIGRATE
            $this->_moveExhibitsToNewTable();
            $this->_setDefaultBaseLayers();
            $this->_createSimileExpansion();
            $this->_migrateSimileDefaults();
            $this->_moveRecordsToNewTable();

            $this->_db->commit();

        } catch (Exception $e) {
            $this->_db->rollback();
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

        $sql = <<<SQL

        INSERT INTO {$this->_db->prefix}neatline_exhibits (
            id,
            title,
            slug,
            public,
            narrative,
            modified,
            query,
            map_focus,
            map_zoom,
            base_layer
        ) SELECT
            id,
            name,
            slug,
            public,
            description,
            modified,
            query,
            default_map_bounds,
            default_map_zoom,
            default_base_layer
        FROM {$this->_db->prefix}neatline_exhibits_migrate;

SQL;

        $this->_db->query($sql);

    }


    /**
     * Transfer all exhibit rows from the renamed migration table into the
     * new `neatline_exhibits` table.
     */
    private function _setDefaultBaseLayers()
    {

        $sql = <<<SQL

        UPDATE {$this->_db->prefix}neatline_exhibits
        SET base_layer = CASE
            WHEN base_layer = 1 THEN 'OpenStreetMap'
            WHEN base_layer = 2 THEN 'GooglePhysical'
            WHEN base_layer = 3 THEN 'GoogleStreets'
            WHEN base_layer = 4 THEN 'GoogleHybrid'
            WHEN base_layer = 5 THEN 'GoogleSatellite'
            WHEN base_layer = 6 THEN 'StamenWatercolor'
            WHEN base_layer = 7 THEN 'StamenToner'
            WHEN base_layer = 8 THEN 'StamenTerrain'
        END;

SQL;

        $this->_db->query($sql);

    }


    /**
     * Insert the `neatline_simile_exhibit_expansions` table created by
     * the NeatlineSimile widget.
     */
    private function _createSimileExpansion()
    {

        $sql = <<<SQL

        CREATE TABLE IF NOT EXISTS

            {$this->_db->prefix}neatline_simile_exhibit_expansions

            `id`            INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `parent_id`     INT(10) UNSIGNED NULL,

            `simile_default_date`       VARCHAR(100) NULL,
            `simile_interval_unit`      VARCHAR(100) NULL,
            `simile_interval_pixels`    INT(10) UNSIGNED NULL,
            `simile_tape_height`        INT(10) UNSIGNED NULL,
            `simile_track_height`       INT(10) UNSIGNED NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL;

        $this->_db->query($sql);

    }


    /**
     * TODO.
     */
    private function _migrateSimileDefaults()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function _moveRecordsToNewTable()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processExtantFields()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processInheritedFields()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processTitleAndBody()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processActivations()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processCoverage()
    {
        // TODO
    }


    /**
     * TODO.
     */
    private function __processWmsLayer()
    {
        // TODO
    }


}
