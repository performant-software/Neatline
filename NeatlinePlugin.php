<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
        'after_save_item',
        'config_form',
        'config'
    );


    protected $_filters = array(
        'public_navigation_main',
        'admin_navigation_main',
        'neatline_globals',
        'neatline_presenters',
        'exhibit_layouts',
        'search_record_types'
    );


    // HOOKS
    // ------------------------------------------------------------------------


    /**
     * Create exhibit and record tables.
     */
    public function hookInstall()
    {
        nl_schema260();
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

        // If trying to upgrade from a pre-2.0 release, throw an error.

        if (version_compare($old, '2.0.0', '<')) {
            throw new Omeka_Plugin_Installer_Exception(
                "Pre-2.0 versions of Neatline can't be upgraded directly to
                version 2.2. Upgrade to version 2.0 first!"
            );
        }

        // Otherwise, run 2.x migrations normally.

        else {

            if (version_compare($old, '2.0.2', '<')) {
                new Neatline_Migration_202();
            }

            if (version_compare($old, '2.1.2', '<')) {
                new Neatline_Migration_212();
            }

            if (version_compare($old, '2.2.0', '<')) {
                new Neatline_Migration_220();
            }

            if (version_compare($old, '2.4.3', '<')) {
                new Neatline_Migration_243();
            }

            if (version_compare($old, '2.5.2', '<')) {
                new Neatline_Migration_252();
            }

            if (version_compare($old, '2.6.0', '<')) {
                new Neatline_Migration_260();
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
     * Shows plugin configuration page.
     */
    public function hookConfigForm($args)
    {
        $view = $args['view'];
        include 'config_form.php';
    }

    /**
     * Saves plugin configuration page.
     *
     * @param array Options set in the config form.
     */
    public function hookConfig($args)
    {
        set_option('neatline_googlemaps_apikey', $_POST['neatline_googlemaps_apikey']);
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

    /**
     * Register the exhibit layout for Nealtine.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function filterExhibitLayouts($layouts)
    {
        $layouts['neatline'] = array(
            'name'        => __('Neatline'),
            'description' => __('Embed a Neatline exhibit.')
        );
        return $layouts;
    }


    /**
     * Add NeatlineExhibit and NeatlineRecord as searchable types.
     */
    public function filterSearchRecordTypes($recordTypes)
    {
      $recordTypes['NeatlineExhibit'] = __('Neatline Exhibit');
      $recordTypes['NeatlineRecord'] = __('Neatline Record');
      return $recordTypes;
    }
}
