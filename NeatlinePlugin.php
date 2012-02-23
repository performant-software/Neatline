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

    private static $_hooks = array(
        'install',
        'uninstall',
        'upgrade',
        'define_routes',
        'admin_theme_header',
        'public_theme_header',
        'admin_append_to_plugin_uninstall_message'
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
                `id`                        int(10) unsigned not null auto_increment,
                `added`                     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `modified`                  TIMESTAMP NULL,
                `name`                      tinytext collate utf8_unicode_ci,
                `map_id`                    int(10) unsigned NULL,
                `image_id`                  int(10) unsigned NULL,
                `top_element`               ENUM('map', 'timeline') DEFAULT 'map',
                `items_h_pos`               ENUM('right', 'left') DEFAULT 'right',
                `items_v_pos`               ENUM('top', 'bottom') DEFAULT 'bottom',
                `items_height`              ENUM('full', 'partial') DEFAULT 'partial',
                `is_map`                    tinyint(1) NOT NULL,
                `is_timeline`               tinyint(1) NOT NULL,
                `is_items`                  tinyint(1) NOT NULL,
                `h_percent`                 int(10) unsigned NULL,
                `v_percent`                 int(10) unsigned NULL,
                `default_map_bounds`        varchar(100) NULL,
                `default_map_zoom`          int(10) unsigned NULL,
                `default_focus_date`        varchar(100) NULL,
                `default_timeline_zoom`     int(10) unsigned NULL,
                `default_vector_color`      tinytext COLLATE utf8_unicode_ci NULL,
                `default_stroke_color`      tinytext COLLATE utf8_unicode_ci NULL,
                `default_highlight_color`   tinytext COLLATE utf8_unicode_ci NULL,
                `default_vector_opacity`    int(10) unsigned NULL,
                `default_stroke_opacity`    int(10) unsigned NULL,
                `default_stroke_width`      int(10) unsigned NULL,
                `default_point_radius`      int(10) unsigned NULL,
                `default_base_layer`        int(10) unsigned NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Records table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_data_records` (
                `id`                        int(10) unsigned not null auto_increment,
                `item_id`                   int(10) unsigned NULL,
                `exhibit_id`                int(10) unsigned NULL,
                `title`                     tinytext COLLATE utf8_unicode_ci NULL,
                `description`               mediumtext COLLATE utf8_unicode_ci NULL,
                `start_date`                tinytext COLLATE utf8_unicode_ci NULL,
                `start_time`                tinytext COLLATE utf8_unicode_ci NULL,
                `end_date`                  tinytext COLLATE utf8_unicode_ci NULL,
                `end_time`                  tinytext COLLATE utf8_unicode_ci NULL,
                `geocoverage`               mediumtext COLLATE utf8_unicode_ci NULL,
                `left_percent`              int(10) unsigned NULL,
                `right_percent`             int(10) unsigned NULL,
                `vector_color`              tinytext COLLATE utf8_unicode_ci NULL,
                `stroke_color`              tinytext COLLATE utf8_unicode_ci NULL,
                `highlight_color`           tinytext COLLATE utf8_unicode_ci NULL,
                `vector_opacity`            int(10) unsigned NULL,
                `stroke_opacity`            int(10) unsigned NULL,
                `stroke_width`              int(10) unsigned NULL,
                `point_radius`              int(10) unsigned NULL,
                `space_active`              tinyint(1) NULL,
                `time_active`               tinyint(1) NULL,
                `display_order`             int(10) unsigned NULL,
                `map_bounds`                varchar(100) NULL,
                `map_zoom`                  int(10) unsigned NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Layers table.
        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_base_layers` (
                `id`                    int(10) unsigned not null auto_increment,
                `name`                  tinytext COLLATE utf8_unicode_ci NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        // Set default map style attributes.
        neatline_setMapStyleDefaults();

        // Install base layers.
        neatline_installBaseLayers();

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

        if (version_compare($oldVersion, '0.1', '<=')) {

            // `modified` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `modified` TIMESTAMP NULL";
            $this->_db->query($sql);

            // `h_percent` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `h_percent` int(10) unsigned NULL";
            $this->_db->query($sql);

            // `v_percent` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `v_percent` int(10) unsigned NULL";
            $this->_db->query($sql);

            // `default_timeline_zoom` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `default_timeline_zoom` int(10) unsigned NULL";
            $this->_db->query($sql);

            // `default_highlight_color` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `default_highlight_color` tinytext COLLATE utf8_unicode_ci NULL";
            $this->_db->query($sql);

            // `default_base_layer` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
                ADD COLUMN `default_base_layer` int(10) unsigned NULL";
            $this->_db->query($sql);

            // `highlight_color` column.
            $sql = "ALTER TABLE `{$this->_db->prefix}neatline_data_records`
                ADD COLUMN `highlight_color` tinytext COLLATE utf8_unicode_ci NULL";
            $this->_db->query($sql);

            // Create layers table.
            $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_base_layers` (
                    `id`                    int(10) unsigned not null auto_increment,
                    `name`                  tinytext COLLATE utf8_unicode_ci NULL,
                     PRIMARY KEY (`id`)
                   ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";
            $this->_db->query($sql);

            // Set default map style attributes.
            neatline_setMapStyleDefaults();

            // Install base layers.
            neatline_installBaseLayers();

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

        // Queue static assets for the Neatline editor.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'editor' &&
            $request->getActionName() == 'index') {

              neatline_queueNeatlineAssets();
              neatline_queueEditorAssets();

        }

    }

    /**
     * Push public-facing Neatline assets.
     *
     * @return void
     */
    public function publicThemeHeader($request)
    {

        // Queue static assets for public-facing Neatline exhibits.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'public') {

            $actionName = $request->getActionName();

            if ($actionName == 'show') {
                neatline_queueInThemeAssets();
                neatline_queueNeatlineAssets();
            }

            else if ($actionName == 'fullscreen') {
                neatline_queueFullscreenAssets();
                neatline_queueNeatlineAssets();
            }

            else if ($actionName == 'embed') {
                neatline_queueEmbedAssets();
                neatline_queueNeatlineAssets();
            }

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

        if (get_plugin_ini('Neatline', 'saas') == 'false') {
            $tabs['Neatline'] = uri('neatline-exhibits');
        }

        return $tabs;

    }

}
