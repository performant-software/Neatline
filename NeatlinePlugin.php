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
?>

<?php

class NeatlinePlugin
{

    private static $_hooks = array(
        'install',
        'uninstall',
        'define_routes',
        'define_acl',
        'admin_theme_header',
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

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_neatlines` (
                `id` int(10) unsigned not null auto_increment,
                `added` timestamp NOT NULL default NOW(),
                `name` tinytext collate utf8_unicode_ci,
                `map_id` int(10) unsigned NULL,
                `timeline_id` int(10) unsigned NULL,
                `top_element` ENUM('map', 'timeline') NOT NULL DEFAULT 'map',
                `undated_items_position` ENUM('right', 'left') NOT NULL DEFAULT 'right',
                `undated_items_height` ENUM('partial', 'full') NOT NULL DEFAULT 'partial',
                `is_map` tinyint(1) NOT NULL,
                `is_timeline` tinyint(1) NOT NULL,
                `is_undated_items` tinyint(1) NOT NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_records` (
                `id` int(10) unsigned not null auto_increment,
                `neatline_id` int(10) unsigned NOT NULL,
                `item_id` int(10) unsigned NOT NULL,
                `element_id` int(10) unsigned NOT NULL,
                `element_text_id` int(10) unsigned NOT NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_time_records` (
                `id` int(10) unsigned not null auto_increment,
                `neatline_id` int(10) unsigned NOT NULL,
                `item_id` int(10) unsigned NOT NULL,
                `start_date_element_text_id` int(10) unsigned NULL,
                `start_time_element_text_id` int(10) unsigned NULL,
                `end_date_element_text_id` int(10) unsigned NULL,
                `end_time_element_text_id` int(10) unsigned NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

        $sql = "CREATE TABLE IF NOT EXISTS `{$this->_db->prefix}neatline_record_statuses` (
                `id` int(10) unsigned not null auto_increment,
                `neatline_id` int(10) unsigned NOT NULL,
                `item_id` int(10) unsigned NOT NULL,
                `space` tinyint(1) NULL,
                `time` tinyint(1) NULL,
                 PRIMARY KEY (`id`)
               ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);

    }

    /**
     * Uninstall.
     *
     * @return void.
     */
    public function uninstall()
    {

        // Drop the exhibits table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_neatlines`";
        $this->_db->query($sql);

        // Drop the records table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_records`";
        $this->_db->query($sql);

        // Drop the time records table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_time_records`";
        $this->_db->query($sql);

        // Drop the statuses table.
        $sql = "DROP TABLE IF EXISTS `{$this->_db->prefix}neatline_record_statuses`";
        $this->_db->query($sql);

    }

    /**
     * Establish access privileges.
     *
     * @return void.
     */
    public function defineAcl($acl)
    {



    }

    /**
     * Include the the neatline CSS changes in the admin header.
     *
     * @return void
     */
    public function adminThemeHeader()
    {

        $request = Zend_Controller_Front::getInstance()->getRequest();

        // Queue CSS.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'index' &&
            $request->getActionName() != 'edit') {

              neatline_queueAdminCss();

        }

        // Queue layout builder JavaScript.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'index' &&
            in_array($request->getActionName(), array('add'))) {

              neatline_queueLayoutBuilderCssAndJs();

        }

        // Queue row glosser for browse actions.
        if ($request->getModuleName() == 'neatline' &&
            $request->getControllerName() == 'index' &&
            $request->getActionName() == 'browse') {

              neatline_queueBrowseJs();

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

        $tabs['Neatline'] = uri('neatline-exhibits');
        return $tabs;

    }

}
