<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Plugin manager class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */


class NeatlinePlugin
{


    // Hooks.
    private static $_hooks = array(
        'install',
        'uninstall',
        'define_routes',
        'define_acl',
        'initialize'
    );

    // Filters.
    private static $_filters = array(
        'admin_navigation_main'
    );

    /**
     * Bind hook and filter callbacks.
     *
     * @return void
     */
    public function __construct()
    {
        $this->db = get_db();
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
     * Hooks:
     */


    /**
     * Create tables.
     *
     * @return void.
     */
    public function install()
    {

    }

    /**
     * Drop tables.
     *
     * @return void.
     */
    public function uninstall()
    {

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
     * Filters:
     */


    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs This is an array of label => URI pairs.
     *
     * @return array The tabs array with the Neatline Maps tab.
     */
    public function adminNavigationMain($tabs)
    {

        if (has_permission('Neatline_Index', 'showNotPublic')) {
            $tabs['Neatline'] = uri('neatline');
        }

        return $tabs;

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

            // Expose public-facing actions.
            $acl->allow(null, 'Neatline_Index', array(
                'browse',
                'show',
                'fullscreen',
                'simile',
                'openlayers',
                'udi'
            ));

        }

    }

    /**
     * Add translation source.
     *
     * @return void.
     */
    public function initialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }

}
