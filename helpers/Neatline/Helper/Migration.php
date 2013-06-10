<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

require_once('geoPHP.inc');

class Neatline_Helper_Migration
{

    /**
     * The NeatlinePlugin
     *
     * @var NeatlinePlugin
     **/
    protected $_plugin;

    /**
     * This is the database.
     *
     * @var Omeka_Db
     **/
    protected $_db;

    public function __construct($plugin, $db)
    {
        $this->_plugin = $plugin;
        $this->_db     = $db;
    }

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
            'Neatline_UpgradeJob', array(
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
    (id, title, slug, public, narrative, modified, query, map_focus, map_zoom)
    SELECT id, name, slug, public, description, modified, query,
        default_map_bounds, default_map_zoom
    FROM {$prefix}exhibits{$ext};
SQL;

        $db->beginTransaction();

        try {
            $db->query($exhibits);

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
        $nlr = new NeatlineRecord(null, null);
        $now = new Zend_Db_Expr('NOW()');

        $nlr->id                    = $data->id;
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

        // TODO: David, check these particularly, please.
        $nlr->fill_color            = $data->vector_color;
        $nlr->fill_opacity          = $this->_opacity($data->vector_opacity);
        $nlr->stroke_color          = $data->stroke_color;
        $nlr->stroke_opacity        = $this->_opacity($data->stroke_opacity);
        $nlr->fill_color_select     = $data->highlight_color;
        $nlr->fill_opacity_select   = $this->_opacity($data->select_opacity);
        $nlr->stroke_color_select   = null;
        $nlr->stroke_opacity_select = null;

        $nlr->stroke_width          = $data->stroke_width;
        $nlr->point_radius          = $data->point_radius;
        $nlr->point_image           = $data->point_image;
        $nlr->zindex                = null;
        $nlr->weight                = $data->display_order;
        $nlr->map_focus             = $data->map_bounds;
        $nlr->map_zoom              = $data->map_zoom;
        $nlr->min_zoom              = null;
        $nlr->max_zoom              = null;

        // WMS fields
        // TODO: Testing
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

        // Dropped:
        // use_dc_metadata
        // graphic_opacity
        // left_percent
        // right_percent
        // space_active

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
                    $coverage = geoPHP::load($coverage,'kml')->out('wkt');

                } else if (strpos($coverage, '|') !== FALSE) {
                    $covs = explode('|', $coverage);
                    $coverage = 'GeometryCollection(' . implode(',', $covs) . ')';
                }
            $nlr->coverage    = $coverage;
            $nlr->is_coverage = TRUE;
        } else {
            $nlr->is_coverage = FALSE;
        }

        // // Old Fields
        // parent_record_id

        return $nlr;
    }

}

