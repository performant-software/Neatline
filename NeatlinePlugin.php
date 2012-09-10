<?php
/**
 * Plugin manager class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlinePlugin extends Omeka_Plugin_AbstractPlugin
{


    // Hooks.
    protected $_hooks = array(
        'install',
        'uninstall',
        'define_routes',
        'before_delete_item',
        'initialize'
    );

    // Filters.
    protected $_filters = array(
        'admin_navigation_main'
    );

    // Layers.
    public static $_baseLayers = array(
        'OpenStreetMap',
        'Google Physical',
        'Google Streets',
        'Google Hybrid',
        'Google Satellite',
        'Stamen Watercolor',
        'Stamen Toner',
        'Stamen Terrain'
    );


    // ------
    // Hooks.
    // ------


    /**
     * Create tables.
     *
     * @return void.
     */
    public function hookInstall()
    {

        // Exhibits table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_exhibits` (
            `id`                          int(10) unsigned not null auto_increment,
            `added`                       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`                    TIMESTAMP NULL,
            `name`                        tinytext collate utf8_unicode_ci,
            `description`                 TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
            `slug`                        varchar(100) NOT NULL,
            `public`                      tinyint(1) NOT NULL,
            `query`                       TEXT COLLATE utf8_unicode_ci NULL,
            `image_id`                    int(10) unsigned NULL,
            `top_element`                 ENUM('map', 'timeline') DEFAULT 'map',
            `items_h_pos`                 ENUM('right', 'left') DEFAULT 'right',
            `items_v_pos`                 ENUM('top', 'bottom') DEFAULT 'bottom',
            `items_height`                ENUM('full', 'partial') DEFAULT 'partial',
            `is_map`                      tinyint(1) NOT NULL,
            `is_timeline`                 tinyint(1) NOT NULL,
            `is_items`                    tinyint(1) NOT NULL,
            `is_context_band`             tinyint(1) NOT NULL,
            `h_percent`                   int(10) unsigned NULL,
            `v_percent`                   int(10) unsigned NULL,
            `default_map_bounds`          varchar(100) NULL,
            `default_map_zoom`            int(10) unsigned NULL,
            `default_focus_date`          varchar(100) NULL,
            `default_timeline_zoom`       int(10) unsigned NULL,
            `default_vector_color`        tinytext COLLATE utf8_unicode_ci NULL,
            `default_stroke_color`        tinytext COLLATE utf8_unicode_ci NULL,
            `default_highlight_color`     tinytext COLLATE utf8_unicode_ci NULL,
            `default_vector_opacity`      int(10) unsigned NULL,
            `default_select_opacity`      int(10) unsigned NULL,
            `default_stroke_opacity`      int(10) unsigned NULL,
            `default_graphic_opacity`     int(10) unsigned NULL,
            `default_stroke_width`        int(10) unsigned NULL,
            `default_point_radius`        int(10) unsigned NULL,
            `default_base_layer`          int(10) unsigned NULL,
            `default_context_band_unit`   ENUM('hour', 'day', 'week', 'month', 'year', 'decade', 'century') DEFAULT 'decade',
            `default_context_band_height` int(10) unsigned NULL,
            `creator_id`                  int(10) unsigned NOT NULL,
             PRIMARY KEY (`id`)
        ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Records table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_data_records` (
            `id`                          int(10) unsigned not null auto_increment,
            `item_id`                     int(10) unsigned NULL,
            `use_dc_metadata`             tinyint(1) NULL,
            `exhibit_id`                  int(10) unsigned NULL,
            `parent_record_id`            int(10) unsigned NULL,
            `show_bubble`                 tinyint(1) NULL,
            `title`                       mediumtext COLLATE utf8_unicode_ci NULL,
            `slug`                        varchar(100) NULL,
            `description`                 mediumtext COLLATE utf8_unicode_ci NULL,
            `start_date`                  tinytext COLLATE utf8_unicode_ci NULL,
            `end_date`                    tinytext COLLATE utf8_unicode_ci NULL,
            `start_visible_date`          tinytext COLLATE utf8_unicode_ci NULL,
            `end_visible_date`            tinytext COLLATE utf8_unicode_ci NULL,
            `geocoverage`                 mediumtext COLLATE utf8_unicode_ci NULL,
            `left_percent`                int(10) unsigned NULL,
            `right_percent`               int(10) unsigned NULL,
            `vector_color`                tinytext COLLATE utf8_unicode_ci NULL,
            `stroke_color`                tinytext COLLATE utf8_unicode_ci NULL,
            `highlight_color`             tinytext COLLATE utf8_unicode_ci NULL,
            `vector_opacity`              int(10) unsigned NULL,
            `select_opacity`              int(10) unsigned NULL,
            `stroke_opacity`              int(10) unsigned NULL,
            `graphic_opacity`             int(10) unsigned NULL,
            `stroke_width`                int(10) unsigned NULL,
            `point_radius`                int(10) unsigned NULL,
            `point_image`                 tinytext COLLATE utf8_unicode_ci NULL,
            `space_active`                tinyint(1) NULL,
            `time_active`                 tinyint(1) NULL,
            `items_active`                tinyint(1) NULL,
            `display_order`               int(10) unsigned NULL,
            `map_bounds`                  varchar(100) NULL,
            `map_zoom`                    int(10) unsigned NULL,
             PRIMARY KEY (`id`)
        ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Add index on exhibit_id.
        $this->_addIndex(
            $this->_db->prefix . 'neatline_data_records',
            $this->_db->prefix . 'neatline_data_records_exhibit_idx',
            'exhibit_id'
        );

        // Layers table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_base_layers` (
                `id`                        int(10) unsigned not null auto_increment,
                `name`                      tinytext COLLATE utf8_unicode_ci NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Install base layers.
        foreach (self::$_baseLayers as $baseLayer) {
            $layer = new NeatlineBaseLayer;
            $layer->name = $baseLayer;
            $layer->save();
        }

    }

    /**
     * Drop tables.
     *
     * @return void.
     */
    public function hookUninstall()
    {

        // Drop the exhibits table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_exhibits`";
        $this->_db->query($sql);

        // Drop the data table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_data_records`";
        $this->_db->query($sql);

        // Drop the data table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_base_layers`";
        $this->_db->query($sql);

        // Remove default map style attributes.
        foreach ($this->_mapStyles as $style) {
          delete_option($style);
        }

    }

    /**
     * Register routes.
     *
     * @param object $router Router passed in by the front controller.
     *
     * @return void
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NEATLINE_PLUGIN_DIR . '/routes.ini', 'routes'));
    }

    /**
     * Add translation source.
     *
     * @return void.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }

    /**
     * Delete data records associated with items that are deleted.
     *
     * @param Omeka_Item $item The item being deleted.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function hookBeforeDeleteItem($args)
    {

        $table   = $this->_db->getTable('NeatlineDataRecord');
        $alias   = $table->getTableAlias();
        $adapter = $table->getAdapter();
        $select  = $table->getSelect();
        $where   = $adapter->quoteInto("$alias.item_id=?", $args['record']->id);

        $select->where($where);

        $this->_db->beginTransaction();
        try {
            $datarecs = $table->fetchObjects($select);
            foreach ($datarecs as $data) {
                $data->delete();
            }
            $this->_db->commit();
        } catch (Exception $e) {
            $this->_db->rollback();
            throw $e;
        }

    }


    // --------
    // Filters.
    // --------


    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs This is an array of label => URI pairs.
     *
     * @return array The tabs array with the Neatline Maps tab.
     */
    public function filterAdminNavigationMain($tabs)
    {
        $tabs['Neatline'] = uri('neatline');
        return $tabs;
    }


    // --------
    // Helpers.
    // --------


    /**
     * Add an index if one doesn't already exist.
     *
     * @param $table  string The name of the table the index is based on.
     * @param $name   string The name of the index to check for.
     * @param $fields string The SQL field list defining the index.
     *
     * @return void
     */
    protected function _addIndex($table, $name, $fields)
    {
        $check = "SHOW INDEX FROM `$table` WHERE key_name=?;";
        if (!$this->_db->query($check, $name)) {
            $sql = "CREATE INDEX $name ON $table ($fields);";
            $this->_db->query($sql);
        }
    }

}
