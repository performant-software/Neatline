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

    protected static $_zoomIndex = array(
        array( 300, 3),
        array( 200, 3),
        array( 100, 3),
        array(  50, 3),
        array( 300, 4),
        array( 200, 4),
        array( 100, 4),
        array(  50, 4),
        array( 300, 5),
        array( 200, 5),
        array( 100, 5),
        array(  50, 5),
        array( 300, 6),
        array( 200, 6),
        array( 100, 6),
        array(  50, 6),
        array( 300, 7),
        array( 200, 7),
        array( 100, 7),
        array(  50, 7),
        array( 300, 8),
        array( 200, 8),
        array( 100, 8),
        array(  50, 8),
        array( 300, 9),
        array( 200, 9),
        array( 100, 9),
        array(  50, 9)
    );

    /**
     * This controls migrating the data.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function migrate()
    {
        $this->backupTables();
        $this->installTables();
        $this->queueJob();
    }

    /**
     * This backs up the old the database tables.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function backupTables()
    {
        $db     = $this->_db;
        $prefix = "{$db->prefix}neatline_";
        $ext    = "_migrate";

        $db->query("ALTER TABLE {$prefix}exhibits     RENAME TO {$prefix}exhibits{$ext};");
        $db->query("ALTER TABLE {$prefix}data_records RENAME TO {$prefix}data_records{$ext};");
        $db->query("ALTER TABLE {$prefix}base_layers  RENAME TO {$prefix}base_layers{$ext};");
    }

    /**
     * This installs the new (v2) tables.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function installTables()
    {
        $this->_plugin->hookInstall();
    }

    /**
     * This queues the background job to migrate the data.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function queueJob()
    {
        Zend_Registry::get('job_dispatcher')->sendLongRunning(
            'Neatline_Job_UpgradeFrom1x', array(
                'web_dir' => nl_getWebDir()
            )
        );
    }

    /**
     * This migrates the data from the old (v1) databases to the new (v2).
     *
     * @return void
     * @author Eric Rochester
     **/
    public function migrateData()
    {

        $db     = $this->_db;
        $prefix = "{$db->prefix}neatline_";
        $ext    = "_migrate";

        $exhibits = <<<SQL
INSERT INTO {$prefix}exhibits
    (id, title, slug, public, narrative, modified, query, map_focus, map_zoom, base_layer)
    SELECT id, name, slug, public, description, modified, query,
        default_map_bounds, default_map_zoom, default_base_layer
    FROM {$prefix}exhibits{$ext};
SQL;

        $layers = <<<SQL
UPDATE {$prefix}exhibits SET base_layer = CASE
    WHEN base_layer = 1 THEN 'OpenStreetMap'
    WHEN base_layer = 2 THEN 'GooglePhysical'
    WHEN base_layer = 3 THEN 'GoogleStreets'
    WHEN base_layer = 4 THEN 'GoogleHybrid'
    WHEN base_layer = 5 THEN 'GoogleSatellite'
    WHEN base_layer = 6 THEN 'StamenWatercolor'
    WHEN base_layer = 7 THEN 'StamenToner'
    WHEN base_layer = 8 THEN 'StamenTerrain'
END
SQL;

        $db->beginTransaction();

        try {
            $db->query($exhibits);
            $db->query($layers);
            $this->_migrateSimileExhibit();

            $q    = $db->query("SELECT * FROM {$prefix}data_records{$ext};");
            $q->setFetchMode(Zend_Db::FETCH_OBJ);
            $rows = $q->fetchAll();
            foreach ($rows as $row) {
                $this->_migrateDataRecord($row)->save();
            }

            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            echo $e->getMessage();
            throw $e;
        }
    }

    /**
     * This migrates the data from the exhibit to a new table for the 
     * NeatlineSimile widget.
     *
     * @return void
     * @author Eric Rochester
     **/
    protected function _migrateSimileExhibit()
    {
        $db     = $this->_db;
        $prefix = "{$db->prefix}neatline_";
        $ext    = "_migrate";
        $table  = $db->getTable('NeatlineExhibit');
        $alias  = $table->getTableAlias();
        $select = $db
            ->select()
            ->from(array('m' => "{$prefix}exhibits{$ext}"))
            ->where('m.is_timeline=1');
        $results = $db->fetchAll($select);

        if (count($results) > 0) {
            $db->query(<<<SQL
CREATE TABLE IF NOT EXISTS
    `{$prefix}simile_exhibit_expansions` (
        `id`            INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `parent_id`     INT(10) UNSIGNED NULL,

        `simile_default_date`       VARCHAR(100) NULL,
        `simile_interval_unit`      VARCHAR(100) NULL,
        `simile_interval_pixels`    INT(10) UNSIGNED NULL,
        `simile_tape_height`        INT(10) UNSIGNED NULL,
        `simile_track_height`       INT(10) UNSIGNED NULL,

         PRIMARY KEY        (`id`)

    ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);
            $sql = <<<SQL
INSERT INTO `{$prefix}simile_exhibit_expansions`
    (parent_id, simile_default_date, simile_interval_unit,
     simile_interval_pixels, simile_tape_height, simile_track_height)
    VALUES (?, ?, ?, ?, 10, 30);
SQL;

            foreach ($results as $r) {
                $focus  = $r['default_timeline_zoom'];
                if (is_null($focus)) {
                    $pixels = null;
                    $units  = null;
                } else {
                    $zoom   = Neatline_Migration_200::$_zoomIndex[$focus];
                    $pixels = $zoom[0];
                    $unit   = $zoom[1];
                }
                $db->query(
                    $sql,
                    array($r['id'], $r['default_focus_date'], $unit, $pixels
                ));
            }
        }

    }

    /**
     * This returns a null-checked, scaled opacity value.
     *
     * @return void
     * @author Eric Rochester
     **/
    private function _opacity($input)
    {
        return is_null($input) ? null : $input / 100.0;
    }

    /**
     * This populates a new NeatlineRecord from the data passed in and saves it.
     *
     * @param $data object The data from the data record as an object.
     *
     * @return NeatlineRecord
     * @author Eric Rochester
     **/
    protected function _migrateDataRecord($data)
    {
        $db = $this->_db;
        $q  = $db->query(
            "SELECT * FROM {$db->prefix}neatline_exhibits_migrate WHERE id=?;",
            array($data->exhibit_id)
        );
        $q->setFetchMode(Zend_Db::FETCH_OBJ);
        $results = $q->fetchAll();
        if (count($results) == 0) {
            $exhibit = null;
        } else {
            $exhibit = $results[0];
        }

        $nlr = new NeatlineRecord(null, null);
        $now = new Zend_Db_Expr('NOW()');

        $nlr->id                    = $data->id;
        $nlr->owner_id              = 0;
        $nlr->item_id               = null;
        $nlr->exhibit_id            = $data->exhibit_id;
        $nlr->added                 = $now;
        $nlr->modified              = $now;
        $nlr->title                 = $data->title;
        $nlr->slug                  = $data->slug;
        $nlr->tags                  = null;
        $nlr->start_date            = $data->start_date;
        $nlr->end_date              = $data->end_date;
        $nlr->after_date            = $data->start_visible_date;
        $nlr->before_date           = $data->end_visible_date;
        $nlr->presenter             = $data->show_bubble ? 'StaticBubble' : 'None';

        $nlr->fill_color            = $data->vector_color;
        $nlr->fill_opacity          = $this->_opacity($this->_getStyle($exhibit, $data, 'vector_opacity'));
        $nlr->stroke_color          = $data->stroke_color;
        $nlr->stroke_opacity        = $this->_opacity($this->_getStyle($exhibit, $data, 'stroke_opacity'));
        $nlr->fill_color_select     = $data->highlight_color;
        $nlr->fill_opacity_select   = $this->_opacity($this->_getStyle($exhibit, $data, 'select_opacity'));
        $nlr->stroke_color_select   = null;
        $nlr->stroke_opacity_select = null;
        $nlr->stroke_width          = $this->_getStyle($exhibit, $data, 'stroke_width');
        $nlr->point_radius          = $this->_getStyle($exhibit, $data, 'point_radius');
        $nlr->point_image           = $data->point_image;
        $nlr->zindex                = null;
        $nlr->weight                = $data->display_order;
        $nlr->map_focus             = $data->map_bounds;
        $nlr->map_zoom              = $data->map_zoom;
        $nlr->min_zoom              = null;
        $nlr->max_zoom              = null;

        // WMS fields
        if (plugin_is_active('NeatlineMaps') && !is_null($data->item_id)) {
            $services = $db->getTable('NeatlineMapsService');
            $sql = "SELECT m.item_id AS item_id, m.address AS address m.layers AS layers "
                . "FROM `{$services->getTableName()}` m"
                . "WHERE item_id=?;";
            $results = $db->fetchAll($sql, $data->item_id);
            foreach ($results as $r) {
                $nlr->is_wms      = true;
                $nlr->wms_address = $r['address'];
                $nlr->wms_layers  = $r['layers'];
            }
        }

        // time_active, items_active
        $widgets = array();
        if ($data->time_active) {
            $widgets[] = 'Simile';
        }
        if ($data->items_active) {
            $widgets[] = 'Waypoints';
        }
        $nlr->widgets = implode(',', $widgets);

        // description
        if (is_null($data->description)
            && !is_null($data->item_id)
            && $data->use_dc_metadata) {

            $item = get_record_by_id('Item', $data->item_id);
            if (!is_null($item)) {
                try {
                    $old = get_current_record('item', $item);
                } catch (Exception $e) {
                    $old = null;
                }
                set_current_record('item', $item);
                try {
                    $nlr->body = nl_getItemMarkup($nlr);
                } catch (Exception $e) {
                    set_current_record('item', $old);
                    throw $e;
                }
                if (!is_null($old)) {
                    set_current_record('item', $old);
                }
            }

        } else {
            $nlr->body = $data->description;
        }

        // geocoverage
        if (!is_null($data->geocoverage)) {
            $coverage = $data->geocoverage;

            if (strpos($coverage, '<?xml') === 0 ||
                strpos($coverage, '<kml') === 0) {
                    $coverage = geoPHP::load($coverage, 'kml')->out('wkt');

                } else if (strpos($coverage, '|') !== FALSE) {
                    $covs = explode('|', $coverage);
                    $coverage = 'GeometryCollection(' . implode(',', $covs) . ')';
                }
            $nlr->coverage    = $coverage;
            $nlr->is_coverage = TRUE;
        } else {
            $nlr->is_coverage = FALSE;
        }

        // Dropped:
        // parent_record_id (handled in the calls to _getStyle above)
        // use_dc_metadata
        // graphic_opacity
        // left_percent
        // right_percent
        // space_active

        return $nlr;
    }

    /**
     * This returns a style property for the old table record.
     *
     * @param object $exhibit The old data exhibit.
     * @param object $data    The old data object.
     * @param string $style   The style name.
     *
     * @return string|int|null The style value.
     * @author Eric Rochester
     **/
    protected function _getStyle($exhibit, $data, $style_name)
    {
        $style = null;

        if (is_null($style) && !is_null($data->$style_name)) {
            $style = $data->$style_name;
        }

        if (is_null($style) && !is_null($data->parent_record_id)) {
            $db = $this->_db;
            $q  = $db->query(
                "SELECT * FROM {$db->prefix}neatline_data_records_migrate WHERE id=?;",
                array($data->parent_record_id)
            );
            $q->setFetchMode(Zend_Db::FETCH_OBJ);
            $parent = $q->fetch();

            $style = $this->_getStyle($exhibit, $parent, $style_name);
        }

        $default_name = "default_$style_name";
        if (!is_null($exhibit) && is_null($style) && !is_null($exhibit->$default_name)) {
            $style = $exhibit->$default_name;
        }

        return $style;
    }

}

