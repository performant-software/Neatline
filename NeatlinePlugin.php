<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlinePlugin extends Omeka_Plugin_AbstractPlugin
{


    protected $_hooks = array(
        'install',
        'uninstall',
        'upgrade',
        'define_acl',
        'initialize',
        'define_routes',
        'after_save_item'
    );


    protected $_filters = array(
        'public_navigation_main',
        'admin_navigation_main',
        'neatline_globals',
        'neatline_presenters'
    );


    // HOOKS
    // ------------------------------------------------------------------------


    /**
     * Create exhibit and record tables.
     */
    public function hookInstall()
    {
        nl_schema220();
    }


    /**
     * Drop exhibit and record tables.
     */
    public function hookUninstall()
    {
        $this->_db->query(<<<SQL
        DROP TABLE {$this->_db->prefix}neatline_exhibits
SQL
);
        $this->_db->query(<<<SQL
        DROP TABLE {$this->_db->prefix}neatline_records
SQL
);
    }


    /**
     * Upgrade the plugin.
     *
     * @param array $args Contains: `old_version` and `new_version`.
     */
    public function hookUpgrade($args)
    {

        $old = $args['old_version'];

        // Block migrations from pre-2.0 versions, which have to be upgraded
        // by way of version 2.0.

        if ($old <= '2.0.0') throw new Exception(
            "Can't upgrade from 1.x. Update to 2.0 first"
        );

        // Otherwise, run 2.x migrations normally.

        else {

            if ($old < '2.0.2') {
                new Neatline_Migration_202($this, $this->_db);
            }

            if ($old < '2.1.2') {
                new Neatline_Migration_212($this, $this->_db);
            }

            if ($old < '2.2.0') {
                new Neatline_Migration_220($this, $this->_db);
            }

        }

    }


    /**
     * Define the ACL.
     *
     * @param array $args Contains: `acl` (Zend_Acl).
     */
    public function hookDefineAcl($args)
    {
        nl_defineAcl($args['acl']);
    }


    /**
     * Add translation source.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__).'/languages');
    }


    /**
     * Register routes.
     *
     * @param array $args Contains: `router` (Zend_Config).
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NL_DIR.'/routes.ini'
        ));
    }


    /**
     * Propagate item updates to Neatline records.
     *
     * @param array $args Contains: `record` (Item).
     */
    public function hookAfterSaveItem($args)
    {
        $records = $this->_db->getTable('NeatlineRecord');
        $records->syncItem($args['record']);
    }


    // FILTERS
    // ------------------------------------------------------------------------


    /**
     * Add link to main public menu bar.
     *
     * @param array $tabs Tabs, <LABEL> => <URI> pairs.
     * @return array The tab array with the "Neatline" tab.
     */
    public function filterPublicNavigationMain($tabs)
    {
        $tabs[] = array('label' => 'Neatline', 'uri' => url('neatline'));
        return $tabs;
    }


    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs Tabs, <LABEL> => <URI> pairs.
     * @return array The tab array with the "Neatline" tab.
     */
    public function filterAdminNavigationMain($tabs)
    {
        $tabs[] = array('label' => 'Neatline', 'uri' => url('neatline'));
        return $tabs;
    }


    /**
     * Register properties on `Neatline.g`.
     *
     * @param array $globals The array of global properties.
     * @param array $args Contains: `exhibit` (NeatlineExhibit).
     * @return array The modified array.
     */
    public function filterNeatlineGlobals($globals, $args)
    {
        return array_merge($globals, nl_globals($args['exhibit']));
    }


    /**
     * Register record presenters.
     *
     * @param array $presenters Presenters, <NAME> => <ID>.
     * @return array The array, with None and StaticBubble.
     */
    public function filterNeatlinePresenters($presenters)
    {
        return array_merge($presenters, array(
            'None'              => 'None',
            'Static Bubble'     => 'StaticBubble'
        ));
    }


}
