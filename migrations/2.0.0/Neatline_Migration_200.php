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


    private static $_zoomIndex = array(
        array( 300, 'HOUR'),
        array( 200, 'HOUR'),
        array( 100, 'HOUR'),
        array(  50, 'HOUR'),
        array( 300, 'DAY'),
        array( 200, 'DAY'),
        array( 100, 'DAY'),
        array(  50, 'DAY'),
        array( 300, 'WEEK'),
        array( 200, 'WEEK'),
        array( 100, 'WEEK'),
        array(  50, 'WEEK'),
        array( 300, 'MONTH'),
        array( 200, 'MONTH'),
        array( 100, 'MONTH'),
        array(  50, 'MONTH'),
        array( 300, 'YEAR'),
        array( 200, 'YEAR'),
        array( 100, 'YEAR'),
        array(  50, 'YEAR'),
        array( 300, 'DECADE'),
        array( 200, 'DECADE'),
        array( 100, 'DECADE'),
        array(  50, 'DECADE'),
        array( 300, 'CENTURY'),
        array( 200, 'CENTURY'),
        array( 100, 'CENTURY'),
        array(  50, 'CENTURY')
    );


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
     * Migrate the old `default_focus_date` and `default_timeline_zoom`
     * fields to the new SIMILE exhibit expansions table.
     */
    private function _migrateSimileDefaults()
    {

        $sql = <<<SQL
        SELECT * FROM {$this->db->prefix}neatline_exhibits_migrate;
SQL;

        $q = $this->db->query($sql);
        $q->setFetchMode(Zend_Db::FETCH_OBJ);
        $oldExhibits = $q->fetchAll();

        foreach ($oldExhibits as $old) {

            // Don't create an expansion if the timeline was disabled on
            // the old exhibit.

            if (!$old->is_timeline) continue;

            // If it is defined, convert the old zoom index into the new
            // unit and pixels values.

            $index = $old->default_timeline_zoom;

            if (!is_null($index)) {
                $zoom   = self::$_zoomIndex[$index];
                $pixels = $zoom[0];
                $unit   = $zoom[1];
            } else {
                $pixels = 100;
                $unit   = 'YEAR';
            }

            $sql = <<<SQL

            INSERT INTO
            {$this->db->prefix}neatline_simile_exhibit_expansions (

                parent_id,
                simile_default_date,
                simile_interval_unit,
                simile_interval_pixels,
                simile_tape_height,
                simile_track_height

            ) VALUES (

                {$old->id},
                "{$old->default_focus_date}",
                "$unit",
                $pixels,
                10,
                30

            );

SQL;

            $this->db->query($sql);

        }

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

            $this->__processExtantFields    ($old, $new);
            $this->__processInheritedFields ($old, $new);
            $this->__processBody            ($old, $new);
            $this->__processPresenter       ($old, $new);
            $this->__processWidgets         ($old, $new);
            $this->__processCoverage        ($old, $new);
            $this->__processWmsLayer        ($old, $new);

            $new->save();

        }

    }


    /**
     * Set all fields that have direct equivalents in the new schema.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
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
     * Flatten out the old style inheritance system by directly setting
     * the inherited values on the new record.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processInheritedFields($old, $new)
    {

        // COLORS
        $new->fill_color = $this->__getStyle(
            $old, 'vector_color'
        );
        $new->fill_color_select = $this->__getStyle(
            $old, 'highlight_color'
        );
        $new->stroke_color = $this->__getStyle(
            $old, 'stroke_color'
        );
        $new->stroke_color_select = $this->__getStyle(
            $old, 'highlight_color'
        );

        // OPACITIES
        $new->fill_opacity = $this->__getStyle(
            $old, 'vector_opacity'
        ) / 100;
        $new->fill_opacity_select = $this->__getStyle(
            $old, 'select_opacity'
        ) / 100;
        $new->stroke_opacity = $this->__getStyle(
            $old, 'stroke_opacity'
        ) / 100;
        $new->stroke_opacity_select = $this->__getStyle(
            $old, 'select_opacity'
        ) / 100;

        // DIMENSIONS
        $new->stroke_width = $this->__getStyle(
            $old, 'stroke_width'
        );
        $new->point_radius = $this->__getStyle(
            $old, 'point_radius'
        );

    }


    /**
     * If the record does not have a parent item - or if it does, and the
     * `use_dc_metadata` flag is flipped off - migrate the `description`
     * field directly to the new `body` field. Otherwise, use the compiled
     * metadata output from the parent item.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processBody($old, $new)
    {

        if (is_null($old->item_id) || $old->use_dc_metadata !== 1) {
            $new->body = $old->description;
        }

        else if (!is_null($old->item_id) && $old->use_dc_metadata == 1) {

            // Get the parent item, set on view.
            $item = get_record_by_id('Item', $old->item_id);
            get_view()->item = $item;

            // Migrate the compiled metadata output.
            $new->body = get_view()->partial('exhibits/item.php');

        }

    }


    /**
     * If `show_bubble` on the old record is flipped on, set `presenter`
     * on the new record to `StaticBubble`; otherwise, `None`.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processPresenter($old, $new)
    {
        $new->presenter = $old->show_bubble ? 'StaticBubble' : 'None';
    }


    /**
     * Convert the old `items_active` and `timeline_active` fields to the
     * new `Wapoints` and `Simile` slugs.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processWidgets($old, $new)
    {

        $widgets = array();

        if ($old->items_active) $widgets[] = 'Waypoints';
        if ($old->time_active)  $widgets[] = 'Simile';

        $new->widgets = implode(',', $widgets);

    }


    /**
     * If the old `geocoverage` is a KML value, convert to WKT. If it is
     * WKT, replace the `|` delimiter with `,` and wrap the pieces inside
     * of a `GEOMETRYCOLLECTION`.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processCoverage($old, $new)
    {

        if (!$old->space_active) return;
        $coverage = $old->geocoverage;

        // KML
        if (strpos($coverage, '<kml') === 0) {
            $new->coverage = geoPHP::load($coverage, 'kml')->out('wkt');
        }

        // WKT
        else if (!is_null($coverage)) {
            $new->coverage = 'GEOMETRYCOLLECTION(' .
                implode(',', explode('|', $coverage)) .
            ')';
        }

    }


    /**
     * If a record has WMS service record, populate the new `wms_address`
     * and `wms_layers` fields if the old record was active on the map.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processWmsLayer($old, $new)
    {

        // Only try to migrate a WMS layer if the record both (a) has a
        // parent item and (b) was active on the map.

        if (is_null($old->item_id) || !$old->space_active) return;

        $sql = <<<SQL
        SELECT * from {$this->db->prefix}neatline_maps_services
        WHERE item_id={$old->item_id};
SQL;

        // Wrap the query in a try/catch, since NeatlineMaps may not be
        // installed, in which case the services table would be absent.

        try {

            $service = $this->db->query($sql)->fetch();

            if ($service) {
                $new->wms_address = $service['address'];
                $new->wms_layers = $service['layers'];
            }

        } catch (Exception $e) {}

    }


    /**
     * Get the concrete value for an inherited field on a data record.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __getStyle($record, $field)
    {

        // If the field is present on the record, return it directly.

        if (!is_null($record->$field)) return $record->$field;

        // Otherwise, if the record has a parent reference, load the
        // parent and recurse.

        else if (!is_null($record->parent_record_id)) {

            $sql = <<<SQL
            SELECT * from {$this->db->prefix}neatline_data_records_migrate
            WHERE id={$record->parent_record_id};
SQL;

            $q = $this->db->query($sql);
            $q->setFetchMode(Zend_Db::FETCH_OBJ);
            $parent = $q->fetch();

            return $this->__getStyle($parent, $field);

        }

        else {

            // If there is no parent record, load the exhibit and try to
            // find a default value for the field.

            if (is_null($record->exhibit_id)) return;

            $sql = <<<SQL
            SELECT * from {$this->db->prefix}neatline_exhibits_migrate
            WHERE id={$record->exhibit_id};
SQL;

            $exhibit = $this->db->query($sql)->fetch();

            if (!is_null($exhibit['default_'.$field])) {
                return $exhibit['default_'.$field];
            }

            // If no exhibit default is defined, fall back to the global
            // default stored in the site options.

            else return get_option($field);

        }

    }


}
