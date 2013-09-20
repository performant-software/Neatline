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

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_exhibits (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            owner_id                INT(10) UNSIGNED NOT NULL,
            added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified                TIMESTAMP NULL,
            published               TIMESTAMP NULL,
            item_query              TEXT NULL,
            spatial_layers          TEXT NULL,
            spatial_layer           TEXT NULL,
            image_layer             TEXT NULL,
            image_height            SMALLINT UNSIGNED NULL,
            image_width             SMALLINT UNSIGNED NULL,
            wms_address             TEXT NULL,
            wms_layers              TEXT NULL,
            widgets                 TEXT NULL,
            title                   TEXT NULL,
            slug                    VARCHAR(100) NOT NULL,
            narrative               LONGTEXT NULL,
            spatial_querying        TINYINT(1) NOT NULL,
            public                  TINYINT(1) NOT NULL,
            styles                  TEXT NULL,
            map_focus               VARCHAR(100) NULL,
            map_zoom                INT(10) UNSIGNED NULL,

            PRIMARY KEY             (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_records (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            owner_id                INT(10) UNSIGNED NOT NULL,
            item_id                 INT(10) UNSIGNED NULL,
            exhibit_id              INT(10) UNSIGNED NULL,
            added                   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            modified                TIMESTAMP NULL,
            is_coverage             TINYINT(1) NOT NULL,
            is_wms                  TINYINT(1) NOT NULL,
            slug                    VARCHAR(100) NULL,
            title                   MEDIUMTEXT NULL,
            body                    MEDIUMTEXT NULL,
            coverage                GEOMETRY NOT NULL,
            tags                    TEXT NULL,
            widgets                 TEXT NULL,
            presenter               VARCHAR(100) NULL,
            fill_color              VARCHAR(100) NULL,
            fill_color_select       VARCHAR(100) NULL,
            stroke_color            VARCHAR(100) NULL,
            stroke_color_select     VARCHAR(100) NULL,
            fill_opacity            DECIMAL(3,2) NULL,
            fill_opacity_select     DECIMAL(3,2) NULL,
            stroke_opacity          DECIMAL(3,2) NULL,
            stroke_opacity_select   DECIMAL(3,2) NULL,
            stroke_width            INT(10) UNSIGNED NULL,
            point_radius            INT(10) UNSIGNED NULL,
            zindex                  INT(10) UNSIGNED NULL,
            weight                  INT(10) UNSIGNED NULL,
            start_date              VARCHAR(100) NULL,
            end_date                VARCHAR(100) NULL,
            after_date              VARCHAR(100) NULL,
            before_date             VARCHAR(100) NULL,
            point_image             VARCHAR(100) NULL,
            wms_address             TEXT NULL,
            wms_layers              TEXT NULL,
            min_zoom                INT(10) UNSIGNED NULL,
            max_zoom                INT(10) UNSIGNED NULL,
            map_zoom                INT(10) UNSIGNED NULL,
            map_focus               VARCHAR(100) NULL,

            PRIMARY KEY             (id),

            INDEX                   (added),
            INDEX                   (exhibit_id, item_id),
            INDEX                   (min_zoom, max_zoom),
            SPATIAL INDEX           (coverage),

            FULLTEXT INDEX          (title, body, slug),
            FULLTEXT INDEX          (tags),
            FULLTEXT INDEX          (widgets)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_exhibit_widgets (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            widget                  VARCHAR(100) NULL,

            PRIMARY KEY             (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_record_widgets (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            widget                  VARCHAR(100) NULL,

            PRIMARY KEY             (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_exhibit_widget_activations (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            exhibit_id              INT(10) UNSIGNED NOT NULL,
            widget_id               INT(10) UNSIGNED NOT NULL,

            PRIMARY KEY             (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

        $this->_db->query(<<<SQL
        CREATE TABLE IF NOT EXISTS
            {$this->_db->prefix}neatline_record_widget_activations (

            id                      INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            record_id               INT(10) UNSIGNED NOT NULL,
            widget_id               INT(10) UNSIGNED NOT NULL,

            PRIMARY KEY             (id)

        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
SQL
);

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

        // If the plugin is being upgraded from the 1.x series, just run the
        // 2.0.0 migration, which encompasses the alpha migrations.

        if ($old <= '1.1.3') {
            new Neatline_Migration_200($this, $this->_db);
        }

        // Otherwise, run 2.x migrations normally.

        else {
            if ($old < '2.0-alpha2') {
                new Neatline_Migration_20alpha2($this, $this->_db);
            }
            if ($old < '2.0-rc1') {
                new Neatline_Migration_20rc1($this, $this->_db);
            }
            if ($old < '2.0-rc3') {
                new Neatline_Migration_20rc3($this, $this->_db);
            }
            if ($old < '2.0-rc4') {
                new Neatline_Migration_20rc4($this, $this->_db);
            }
            if ($old < '2.0.2') {
                new Neatline_Migration_202($this, $this->_db);
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
