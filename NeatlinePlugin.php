<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Plugin manager class.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class NeatlinePlugin
{

    private static $_mapStyles = array(
        'vector_color',
        'stroke_color',
        'highlight_color',
        'vector_opacity',
        'select_opacity',
        'stroke_opacity',
        'graphic_opacity',
        'stroke_width',
        'point_radius',
        'h_percent',
        'v_percent',
        'timeline_zoom',
        'context_band_unit',
        'context_band_height'
    );

    private static $_hooks = array(
        'install',
        'uninstall',
        'upgrade',
        'define_routes',
        'admin_theme_header',
        'admin_append_to_plugin_uninstall_message',
        'before_delete_item',
        'define_acl',
        'initialize'
    );

    private static $_filters = array(
        'admin_navigation_main'
    );

    /**
     * Get database, call addHooksAndFilters().
     *
     * @return void
     */
    public function __construct()
    {

        $this->_db = get_db();
        self::addHooksAndFilters();

    }

    /**
     * Iterate over hooks and filters, define callbacks.
     *
     * @return void
     */
    public function addHooksAndFilters()
    {

        foreach (self::$_hooks as $hookName) {
            $functionName = Inflector::variablize($hookName);
            add_plugin_hook($hookName, array($this, $functionName));
        }

        foreach (self::$_filters as $filterName) {
            $functionName = Inflector::variablize($filterName);
            add_filter($filterName, array($this, $functionName));
        }

    }

    /**
     * Hook callbacks:
     */

    /**
     * Install. Create _neatlines table.
     *
     * @return void.
     */
    public function install()
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

        $this->_addIndex(
            $this->_db->prefix . 'neatline_data_records',
            $this->_db->prefix . 'neatline_data_records_exhibit_idx',
            'exhibit_id'
        );
        /**
         * This doesn't seem to help, but I'm leaving it here as a record that
         * we tried it.
         * $this->_addIndex(
         *     $this->_db->prefix . 'neatline_data_records',
         *     $this->_db->prefix . 'neatline_data_records_exhibit_item_idx',
         *     'exhibit_id, item_id'
         * );
         */

        // Layers table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_base_layers` (
                `id`                        int(10) unsigned not null auto_increment,
                `name`                      tinytext COLLATE utf8_unicode_ci NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Set default map style attributes.
        foreach (self::$_mapStyles as $style) {
          set_option($style, get_plugin_ini('Neatline', 'default_'.$style));
        }

        // Install base layers.
        $baseLayers = array(
            'OpenStreetMap',
            'Google Physical',
            'Google Streets',
            'Google Hybrid',
            'Google Satellite',
            'Stamen Watercolor',
            'Stamen Toner',
            'Stamen Terrain'
        );

        foreach ($baseLayers as $baseLayer) {
            $layer = new NeatlineBaseLayer;
            $layer->name = $baseLayer;
            $layer->save();
        }

    }

    /**
     * Uninstall.
     *
     * @return void.
     */
    public function uninstall()
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
        foreach (self::$_mapStyles as $style) {
          delete_option($style);
        }

    }

    /**
     * Upgrade.
     *
     * @param string $oldVersion: The current version number.
     * @param string $newVersion: The target version number.
     *
     * @return void.
     */
    public function upgrade($oldVersion, $newVersion)
    {

        if (version_compare($oldVersion, '1.0.6', '<=')) {

            // `default_graphic_opacity` column.
            if (!$this->_db->getTable('NeatlineExhibit')->hasColumn('default_graphic_opacity')) {

                $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                    ADD COLUMN `default_graphic_opacity` int(10) unsigned NULL";
                $this->_db->query($sql);

            }

            // `graphic_opacity` column.
            if (!$this->_db->getTable('NeatlineDataRecord')->hasColumn('graphic_opacity')) {

                $sql = "ALTER TABLE `{$this->_db->prefix}neatline_data_records`
                    ADD COLUMN `graphic_opacity` int(10) unsigned NULL";
                $this->_db->query($sql);

            }

            // `point_image` column.
            if (!$this->_db->getTable('NeatlineDataRecord')->hasColumn('point_image')) {

                $sql = "ALTER TABLE `{$this->_db->prefix}neatline_data_records`
                    ADD COLUMN `point_image` tinytext COLLATE utf8_unicode_ci NULL";
                $this->_db->query($sql);

            }

            // Set default option.
            set_option('graphic_opacity', (int) get_plugin_ini(
                'Neatline',
                'default_graphic_opacity'
            ));

        }

        if (version_compare($oldVersion, '1.0.1', '<=')) {

            delete_option('h_precent');

            set_option('h_percent', get_plugin_ini(
                'Neatline',
                'default_h_percent'
            ));

        }

    }

    /**
     * Push administrative Neatline assets.
     *
     * @return void
     */
    public function adminThemeHeader($request)
    {

        // Queue CSS.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'index') {
              neatline_queueAdminCss();
        }

    }

    /**
     * Register routes.
     *
     * @param object $router Router passed in by the front controller.
     *
     * @return void
     */
    public function defineRoutes($router)
    {
        $router->addConfig(new Zend_Config_Ini(NEATLINE_PLUGIN_DIR
            .'/routes.ini', 'routes'));
    }

    /**
     * Flash warning about table drops before uninstall.
     *
     * @return void
     */
    public function adminAppendToPluginUninstallMessage()
    {
        echo neatline_uninstallWarningMessage();
    }

    /**
     * Filter callbacks:
     *

    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs This is an array of label => URI pairs.
     *
     * @return array The tabs array with the Neatline Maps tab.
     */
    public function adminNavigationMain($tabs)
    {

        if (get_plugin_ini('Neatline', 'saas') == 'false' && has_permission('Neatline_Index', 'showNotPublic')) {
            $tabs['Neatline'] = uri('neatline-exhibits');
        }

        return $tabs;

    }

    /**
     * This deletes data records associated with items that are deleted.
     *
     * @param Omeka_Item $item The item being deleted.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function beforeDeleteItem($item)
    {

        $db      = get_db();
        $table   = $db->getTable('NeatlineDataRecord');
        $alias   = $table->getTableAlias();
        $adapter = $table->getAdapter();
        $select  = $table->getSelect();
        $where   = $adapter->quoteInto("$alias.item_id=?", $item->id);

        $select->where($where);

        $db->beginTransaction();
        try {
            $datarecs = $table->fetchObjects($select);
            foreach ($datarecs as $data) {
                $data->delete();
            }
            $db->commit();
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }

    }

    /**
     * Define the ACL
     */
    public function defineAcl($acl)
    {
        $resourceList = array(
            'Neatline_Index' => array(
                'add',
                'browse',
                'edit',
                'query',
                'delete',
                'show',
                'showNotPublic',
                'fullscreen',
                'fullscreenNotPublic',
                'udi',
                'simile',
                'openlayers'
              ),
            'Neatline_Editor' => array(
                'index',
                'items',
                'form',
                'save',
                'status',
                'order',
                'positions',
                'arrangement',
                'focus',
                'mapsettings',
                'timelinesettings',
                'resetstyles',
                'dcdefault'
            )
        );

        if (!$acl->has('Neatline_Index')) {
            $acl->loadResourceList($resourceList);
            foreach ($resourceList as $resource => $privileges) {
                $acl->deny(null, $resource);
                $acl->allow('super', $resource);
                $acl->allow('admin', $resource);
            }

            // Give every access to browse, show, simile, openlayers, and udi.
            $acl->allow(null, 'Neatline_Index', array('browse', 'show','fullscreen','simile','openlayers','udi'));
        }

    }

    /**
     * Initialization.
     *
     * Adds translation source.
     *
     * @return void.
     */
    public function initialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }

    /**
     * This adds an index, if it doesn't exist.
     *
     * @param $table  string The name of the table the index is based on.
     * @param $name   string The name of the index to check for.
     * @param $fields string The SQL field list defining the index.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    protected function _addIndex($table, $name, $fields)
    {
        $check = "SHOW INDEX FROM `$table` WHERE key_name=?;";
        if (!$this->_db->query($check, $name)) {
            $sql = "CREATE INDEX $name ON $table ($fields);";
            $this->_db->query($sql);
        }
    }
}
