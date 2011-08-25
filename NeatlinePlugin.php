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
 * @copyright   2010 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php

class NeatlinePlugin
{

    private static $_hooks = array(
        'install',
        'uninstall',
        'define_routes'
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
     * Install. Create _neatline_maps table, add new item type.
     *
     * @return void.
     */
    public function install()
    {

        $db = $this->_db;

        $db->query("
            CREATE TABLE IF NOT EXISTS `$db->Neatline` (
                `id` int(10) unsigned NOT NULL auto_increment,
                `name` tinytext collate utf8_unicode_ci,
                `map_id` int(10) unsigned NULL,
                `timeline_id` int(10) unsigned NULL,
                PRIMARY KEY (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci
            ");

    }

    /**
     * Uninstall.
     *
     * @return void.
     */
    public function uninstall()
    {



    }

    /**
     * Register routes in routes.ini.
     *
     * @param object $router Router passed in by the front controller.
     *
     * @return void
     */
    public function defineRoutes($router)
    {

        $router->addConfig(new Zend_Config_Ini(NEATLINE_MAPS_PLUGIN_DIR .
            DIRECTORY_SEPARATOR . 'routes.ini', 'routes'));

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

        $tabs['Neatline'] = uri('');
        return $tabs;

    }

}
