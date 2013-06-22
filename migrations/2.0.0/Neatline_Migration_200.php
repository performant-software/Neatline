<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


require_once dirname(__FILE__) . '/libraries/geoPHP/geoPHP.inc';


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

            $this->_moveExhibitsToNewTable();
            $this->_setDefaultBaseLayers();
            $this->_migrateSimileDefaults();
            $this->_moveRecordsToNewTable();
            $this->db->commit();

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

        $sql1 = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        RENAME TO {$this->db->prefix}neatline_exhibits_migrate;
SQL;

        $sql2 = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_data_records
        RENAME TO {$this->db->prefix}neatline_data_records_migrate;
SQL;

        $sql3 = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_base_layers
        RENAME TO {$this->db->prefix}neatline_base_layers_migrate;
SQL;

        $this->db->query($sql1);
        $this->db->query($sql2);
        $this->db->query($sql3);

    }


    /**
     * Install the new 2.0.0 schema.
     */
    private function _installNewTables()
    {

        // Install the default Neatline tables.

        $this->plugin->hookInstall();

        // Install the SIMILE exhibit expansion table.

        $sql = <<<SQL

        CREATE TABLE IF NOT EXISTS
        {$this->db->prefix}neatline_simile_exhibit_expansions (

            id          INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            parent_id   INT(10) UNSIGNED NULL,

            simile_default_date     VARCHAR(100) NULL,
            simile_interval_unit    VARCHAR(100) NULL,
            simile_interval_pixels  INT(10) UNSIGNED NULL,
            simile_tape_height      INT(10) UNSIGNED NULL,
            simile_track_height     INT(10) UNSIGNED NULL,

            PRIMARY KEY             (id)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

SQL;

        $this->db->query($sql);

    }


    /**
     * Queue the background process to migrate the data.
     */
    private function _queueMigration()
    {
        Zend_Registry::get('job_dispatcher')->sendLongRunning(
            'Neatline_Job_UpgradeFrom1x'
        );
    }


    /**
     * Transfer all exhibit rows from the renamed migration table into the
     * new `neatline_exhibits` table.
     */
    private function _moveExhibitsToNewTable()
    {

        $sql = <<<SQL

        INSERT INTO {$this->db->prefix}neatline_exhibits (

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

        FROM {$this->db->prefix}neatline_exhibits_migrate;

SQL;

        $this->db->query($sql);

    }


    /**
     * Transfer all exhibit rows from the renamed migration table into the
     * new `neatline_exhibits` table.
     */
    private function _setDefaultBaseLayers()
    {

        $sql = <<<SQL
        UPDATE {$this->db->prefix}neatline_exhibits

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

        $this->db->query($sql);

    }


    /**
     * TODO.
     */
    private function _migrateSimileDefaults()
    {

    }


    /**
     * Load all of the old record rows, migrate the data, and save new 2.x
     * records on the `neatline_records` table.`
     */
    private function _moveRecordsToNewTable()
    {

        $sql = <<<SQL
        SELECT * FROM {$this->db->prefix}neatline_data_records_migrate;
SQL;

        $q = $this->db->query($sql);
        $q->setFetchMode(Zend_Db::FETCH_OBJ);
        $oldRecords = $q->fetchAll();

        foreach ($oldRecords as $old) {
            $new = new NeatlineRecord;
            $this->__processExtantFields($old, $new);
            $this->__processCoverage($old, $new);
            var_dump($new->coverage);
            $new->save();
        }

    }


    /**
     * Set all fields that have direct equivalents in the new schema. Set
     * the `owner_id` field to the default 0.
     */
    private function __processExtantFields($old, $new)
    {
        $new->id            = $old->id;
        $new->exhibit_id    = $old->exhibit_id;
        $new->title         = $old->title;
        $new->slug          = $old->slug;
        $new->start_date    = $old->start_date;
        $new->end_date      = $old->end_date;
        $new->after_date    = $old->start_visible_date;
        $new->before_date   = $old->end_visible_date;
        $new->point_image   = $old->point_image;
        $new->weight        = $old->display_order;
        $new->map_focus     = $old->map_bounds;
        $new->map_zoom      = $old->map_zoom;
    }


    /**
     * TODO.
     */
    private function __processInheritedFields($old, $new)
    {

    }


    /**
     * TODO.
     */
    private function __processTitleAndBody($old, $new)
    {

    }


    /**
     * TODO.
     */
    private function __processActivations($old, $new)
    {

    }


    /**
     * TODO.
     */
    private function __processCoverage($old, $new)
    {

        $coverage = $old->geocoverage;

        // KML
        if (strpos($coverage, '<kml') === 0) {
            $new->coverage = geoPHP::load($coverage, 'kml')->out('wkt');
        }

        // WKT
        else if (strpos($coverage, '|') !== false) {
            $new->coverage = 'GEOMETRYCOLLECTION(' .
                implode(',', explode('|', $coverage)) .
            ')';
        }

    }


    /**
     * TODO.
     */
    private function __processWmsLayer($old, $new)
    {

    }


}
