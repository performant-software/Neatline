<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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
        'define_acl',
        'initialize',
        'define_routes',
        'after_save_item'
    );


    protected $_filters = array(
        'admin_navigation_main',
        'neatline_globals',
        'neatline_presenters',
        'neatline_styles'
    );


    /**
     * Create exhibit and record tables.
     */
    public function hookInstall()
    {


        $this->_db->query("CREATE TABLE IF NOT EXISTS
        `{$this->_db->prefix}neatline_exhibits` (

        `id`                    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `user_id`               INT(10) UNSIGNED NOT NULL,
        `added`                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `modified`              TIMESTAMP NOT NULL,
        `query`                 TEXT NULL,
        `base_layers`           TEXT NULL,
        `base_layer`            VARCHAR(100) NULL,
        `widgets`               TEXT NULL,
        `title`                 TEXT NULL,
        `slug`                  VARCHAR(100) NOT NULL,
        `narrative`             LONGTEXT NULL,
        `public`                TINYINT(1) NOT NULL,
        `styles`                TEXT NULL,
        `map_focus`             VARCHAR(100) NULL,
        `map_zoom`              INT(10) UNSIGNED NULL,

         PRIMARY KEY            (`id`)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");


        $this->_db->query("CREATE TABLE IF NOT EXISTS
        `{$this->_db->prefix}neatline_records` (

        `id`                    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `user_id`               INT(10) UNSIGNED NOT NULL,
        `item_id`               INT(10) UNSIGNED NULL,
        `exhibit_id`            INT(10) UNSIGNED NULL,
        `added`                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `modified`              TIMESTAMP NOT NULL,
        `is_coverage`           TINYINT(1) NULL,
        `is_wms`                TINYINT(1) NULL,
        `slug`                  VARCHAR(100) NULL,
        `title`                 MEDIUMTEXT NULL,
        `body`                  MEDIUMTEXT NULL,
        `coverage`              GEOMETRY NOT NULL,
        `tags`                  TEXT NULL,
        `widgets`               TEXT NULL,
        `presenter`             VARCHAR(100) NULL,
        `fill_color`            VARCHAR(100) NULL,
        `fill_color_select`     VARCHAR(100) NULL,
        `stroke_color`          VARCHAR(100) NULL,
        `stroke_color_select`   VARCHAR(100) NULL,
        `fill_opacity`          DECIMAL(3,2) NULL,
        `fill_opacity_select`   DECIMAL(3,2) NULL,
        `stroke_opacity`        DECIMAL(3,2) NULL,
        `stroke_opacity_select` DECIMAL(3,2) NULL,
        `stroke_width`          INT(10) UNSIGNED NULL,
        `point_radius`          INT(10) UNSIGNED NULL,
        `zindex`                INT(10) UNSIGNED NULL,
        `weight`                INT(10) UNSIGNED NULL,
        `start_date`            VARCHAR(100) NULL,
        `end_date`              VARCHAR(100) NULL,
        `after_date`            VARCHAR(100) NULL,
        `before_date`           VARCHAR(100) NULL,
        `point_image`           VARCHAR(100) NULL,
        `wms_address`           VARCHAR(100) NULL,
        `wms_layers`            VARCHAR(100) NULL,
        `min_zoom`              INT(10) UNSIGNED NULL,
        `max_zoom`              INT(10) UNSIGNED NULL,
        `map_zoom`              INT(10) UNSIGNED NULL,
        `map_focus`             VARCHAR(100) NULL,

         PRIMARY KEY            (`id`),
         INDEX                  (`item_id`, `exhibit_id`),
         FULLTEXT KEY           (`title`, `body`),
         SPATIAL INDEX          (`coverage`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");


    }


    /**
     * Drop exhibit and record tables.
     */
    public function hookUninstall()
    {

        // Exhibits:
        $this->_db->query("DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_exhibits`"
        );

        // Records:
        $this->_db->query("DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_records`"
        );

    }


    /**
     * Define the ACL.
     *
     * @param array $args Zend_Acl instance under `acl` key.
     */
    public function hookDefineAcl($args)
    {

        $acl = $args['acl'];

        // Register resources.
        if (!$acl->has('NeatlineExhibit')) {
            $acl->addResource('NeatlineExhibit');
        }
        if (!$acl->has('NeatlineRecord')) {
            $acl->addResource('NeatlineRecord');
        }

        // Anonymous:
        // ----------

        // Anyone can retrieve exhibits.
        $acl->allow(null, 'NeatlineExhibit', array(
            'show',
            'browse',
            'get'
        ));

        // Anyone can retrieve records.
        $acl->allow(null, 'NeatlineRecord', array(
            'list',
            'get'
        ));

        // Contributor:
        // ------------

        // Contributors can create exhibits.
        $acl->allow('contributor', 'NeatlineExhibit', 'add');

        // Contributors can edit their own exhibits.
        $acl->allow('contributor', 'NeatlineExhibit', array(
            'editSelf',
            'editorSelf',
            'putSelf',
            'importSelf',
            'deleteSelf'
        ));
        $acl->allow('contributor', 'NeatlineExhibit', array(
            'edit',
            'editor',
            'put',
            'import',
            'delete'
        ), new Omeka_Acl_Assert_Ownership);

        // Contributors can edit records in their own exhibits.
        $acl->allow('contributor', 'NeatlineRecord', array(
            'postSelf',
            'putSelf',
            'deleteSelf'
        ));
        $acl->allow('contributor', 'NeatlineRecord', array(
            'post',
            'put',
            'delete'
        ), new Neatline_Acl_Assert_ExhibitOwnership);

        // Admin:
        // ------

        // Admins can create exhibits.
        $acl->allow('admin', 'NeatlineExhibit', 'add');

        // Admins can edit their own exhibits.
        $acl->allow('admin', 'NeatlineExhibit', array(
            'editSelf',
            'editorSelf',
            'putSelf',
            'importSelf',
            'deleteSelf'
        ));
        $acl->allow('admin', 'NeatlineExhibit', array(
            'edit',
            'editor',
            'put',
            'import',
            'delete'
        ), new Omeka_Acl_Assert_Ownership);

        // Admins can edit their own records in all exhibits.
        $acl->allow('admin', 'NeatlineRecord', array(
            'postSelf',
            'putSelf',
            'deleteSelf'
        ));
        $acl->allow('admin', 'NeatlineRecord', array(
            'post',
            'put',
            'delete'
        ), new Omeka_Acl_Assert_Ownership);

        // Super:
        // ------

        // Supers can do everything.
        $acl->allow('super', 'NeatlineExhibit');
        $acl->allow('super', 'NeatlineRecord');


    }


    /**
     * Add translation source.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }


    /**
     * Register routes.
     *
     * @param array $args Zend_Config instance under `router` key.
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NL_DIR . '/routes.ini', 'routes')
        );
    }


    /**
     * Propagate item updates to Neatline records.
     *
     * @param array $args Array of arguments, with `record`.
     */
    public function hookAfterSaveItem($args)
    {
        $records = $this->_db->getTable('NeatlineRecord');
        $records->syncItem($args['record']);
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
     * Register properties on `Neatline.global`.
     *
     * @param array $globals The array of global properties.
     * @param array $args Array of arguments, with `exhibit`.
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
            'None' => 'None',
            'Static Bubble' => 'StaticBubble'
        ));
    }


    /**
     * Register the taggable styles.
     *
     * @param array $styles Array of column names.
     * @return array The modified array.
     */
    public function filterNeatlineStyles($styles)
    {
        return array_merge($styles, array(

            // Groups
            'widgets',
            'presenter',

            // Colors
            'fill_color',
            'fill_color_select',
            'stroke_color',
            'stroke_color_select',

            // Opacities
            'fill_opacity',
            'fill_opacity_select',
            'stroke_opacity',
            'stroke_opacity_select',

            // Dimensions
            'stroke_width',
            'point_radius',
            'zindex',
            'weight',

            // Dates
            'start_date',
            'end_date',
            'after_date',
            'before_date',

            // Imagery
            'point_image',
            'wms_address',
            'wms_layers',

            // Visibility
            'min_zoom',
            'max_zoom',
            'map_focus',
            'map_zoom'

        ));
    }


}
