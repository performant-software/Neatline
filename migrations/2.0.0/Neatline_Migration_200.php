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


    private static $zooms = array(
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


    private static $layers = array(
        'OpenStreetMap',
        'GooglePhysical',
        'GoogleStreets',
        'GoogleHybrid',
        'GoogleSatellite',
        'StamenWatercolor',
        'StamenToner',
        'StamenTerrain',
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
        SELECT * FROM {$this->db->prefix}neatline_exhibits_migrate;
SQL;

        $q = $this->db->query($sql);
        $q->setFetchMode(Zend_Db::FETCH_OBJ);
        $oldExhibits = $q->fetchAll();

        foreach ($oldExhibits as $old) {

            $new = new NeatlineExhibit;

            $this->__processExhbibitExtantFields    ($old, $new);
            $this->__processExhibitDefaultBaseLayer ($old, $new);
            $this->__processExhibitSimileDefaults   ($old, $new);
            $this->__processExhibitStaticImage      ($old, $new);
            $this->__processExhibitWidgets          ($old, $new);

            $new->save();

        }

    }


    /**
     * Set all exhibit fields that have direct analogs in the new schema.
     *
     * @param object $old The original `neatline_exhibits` row.
     * @param NeatlineExhibit $new The new exhibit instance.
     */
    private function __processExhbibitExtantFields($old, $new)
    {
        $new->id            = $old->id;
        $new->title         = $old->name;
        $new->slug          = $old->slug;
        $new->public        = $old->public;
        $new->narrative     = $old->description;
        $new->item_query    = $old->query;
        $new->map_focus     = $old->default_map_bounds;
        $new->map_zoom      = $old->default_map_zoom;
    }


    /**
     * Convert the old foreign key reference on `default_base_layer` to
     * the corresponding layer slug.
     *
     * @param object $old The original `neatline_exhibits` row.
     * @param NeatlineExhibit $new The new exhibit instance.
     */
    private function __processExhibitDefaultBaseLayer($old, $new)
    {
        $new->spatial_layer = self::$layers[$old->default_base_layer-1];
    }


    /**
     * Migrate the old `default_focus_date` and `default_timeline_zoom`
     * fields to the new SIMILE exhibit expansions table.
     *
     * @param object $old The original `neatline_exhibits` row.
     * @param NeatlineExhibit $new The new exhibit instance.
     */
    private function __processExhibitSimileDefaults($old, $new)
    {

        $index = $old->default_timeline_zoom;

        if (!is_null($index)) {
            $zoom   = self::$zooms[$index];
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

            {$new->id},
            "{$old->default_focus_date}",
            "$unit",
            $pixels,
            10,
            30

        );

SQL;

        $this->db->query($sql);

    }


    /**
     * Convert the old `image_id` key to the new `image_layer` URL.
     *
     * @param object $old The original `neatline_exhibits` row.
     * @param NeatlineExhibit $new The new exhibit instance.
     */
    private function __processExhibitStaticImage($old, $new)
    {
        if ($old->image_id) {
            $file = $this->db->getTable('File')->find($old->image_id);
            if ($file) $new->image_layer = $file->getWebPath();
        }
    }


    /**
     * Convert the old `is_items` and `is_timeline` fields to the new
     * `Waypoints` and `Simile` slugs.
     *
     * @param object $old The original `neatline_exhibits` row.
     * @param NeatlineExhibit $new The new exhibit instance.
     */
    private function __processExhibitWidgets($old, $new)
    {

        $widgets = array();

        if ($old->is_items)     $widgets[] = 'Waypoints';
        if ($old->is_timeline)  $widgets[] = 'Simile';

        $new->widgets = implode(',', $widgets);

    }


    /**
     * Load all of the old record rows, migrate the data, and save new 2.x
     * records on the `neatline_records` table.
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

            $this->__processRecordExtantFields      ($old, $new);
            $this->__processRecordInheritedFields   ($old, $new);
            $this->__processRecordTitle             ($old, $new);
            $this->__processRecordBody              ($old, $new);
            $this->__processRecordPresenter         ($old, $new);
            $this->__processRecordWidgets           ($old, $new);
            $this->__processRecordCoverage          ($old, $new);
            $this->__processRecordWmsLayer          ($old, $new);

            $new->save();

        }

    }


    /**
     * Set all record fields that have direct analogs in the new schema.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processRecordExtantFields($old, $new)
    {
        $new->id            = $old->id;
        $new->exhibit_id    = $old->exhibit_id;
        $new->slug          = $old->slug;
        $new->start_date    = $old->start_date;
        $new->end_date      = $old->end_date;
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
    private function __processRecordInheritedFields($old, $new)
    {

        $fColor         = $this->__getStyle($old, 'vector_color');
        $fColorSelect   = $this->__getStyle($old, 'highlight_color');
        $sColor         = $this->__getStyle($old, 'stroke_color');
        $sColorSelect   = $this->__getStyle($old, 'highlight_color');
        $fOpacity       = $this->__getStyle($old, 'vector_opacity')/100;
        $fOpacitySelect = $this->__getStyle($old, 'select_opacity')/100;
        $sOpacity       = $this->__getStyle($old, 'stroke_opacity')/100;
        $sOpacitySelect = $this->__getStyle($old, 'select_opacity')/100;
        $sWidth         = $this->__getStyle($old, 'stroke_width');
        $pRadius        = $this->__getStyle($old, 'point_radius');
        $aDate          = $this->__getStyle($old, 'start_visible_date');
        $bDate          = $this->__getStyle($old, 'end_visible_date');

        $new->fill_color                = $fColor;
        $new->fill_color_select         = $fColorSelect;
        $new->stroke_color              = $sColor;
        $new->stroke_color_select       = $sColorSelect;
        $new->fill_opacity              = $fOpacity;
        $new->fill_opacity_select       = $fOpacitySelect;
        $new->stroke_opacity            = $sOpacity;
        $new->stroke_opacity_select     = $sOpacitySelect;
        $new->stroke_width              = $sWidth;
        $new->point_radius              = $pRadius;
        $new->after_date                = $aDate;
        $new->before_date               = $bDate;

    }


    /**
     * If the record does not have a parent item, migrate the `title`
     * field directly. If it does have a parent but there is a locally-
     * set value on the record, migrate the extant value; if `title` is 
     * null, use the Dublin Core "Title" field on the parent item.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processRecordTitle($old, $new)
    {

        // If a local value exists, migrate it directly.
        if (is_null($old->item_id) || !is_null($old->title)) {
            $new->title = $old->title;
        }

        else if (!is_null($old->item_id)) {

            $item = get_record_by_id('Item', $old->item_id);
            if (!$item) return;

            // Else, try to set the parent item "Title".
            $new->title = metadata($item, array('Dublin Core', 'Title'));

        }

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
    private function __processRecordBody($old, $new)
    {

        // If a local value exists, migrate it directly
        if (is_null($old->item_id) || $old->use_dc_metadata !== 1) {
            $new->body = $old->description;
        }

        else if (!is_null($old->item_id) && $old->use_dc_metadata == 1) {

            $item = get_record_by_id('Item', $old->item_id);
            if (!$item) return;

            // Set item on the view.
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
    private function __processRecordPresenter($old, $new)
    {
        $new->presenter = $old->show_bubble ? 'StaticBubble' : 'None';
    }


    /**
     * Convert the old `items_active` and `timeline_active` fields to the
     * new `Waypoints` and `Simile` slugs.
     *
     * @param object $old The original `neatline_data_records` row.
     * @param NeatlineRecord $new The new record instance.
     */
    private function __processRecordWidgets($old, $new)
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
    private function __processRecordCoverage($old, $new)
    {

        if (!$old->space_active) return;
        $coverage = $old->geocoverage;

        // KML
        if (strpos($coverage, '<kml') === 0) {
            try {
                $new->coverage = geoPHP::load($coverage)->out('wkt');
            } catch (Exception $e) {}
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
    private function __processRecordWmsLayer($old, $new)
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
            $key = 'default_' . $field;

            // If the old exhibit does have have a `default_`-prefixed
            // attribute for the field, return NULL.

            if (!$exhibit || !array_key_exists($key, $exhibit)) return;

            // If the exhibit has a default attribute with a non-null
            // value, return the exhibit default.

            else if (!is_null($exhibit[$key])) return $exhibit[$key];

            // If exhibit-default field is empty, fall back to the global
            // default stored in the site options.

            else return get_option($field);

        }

    }


}
