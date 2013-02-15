<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

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
        'initialize',
        'define_routes',
        'after_save_item'
    );


    // Filters.
    protected $_filters = array(
        'admin_navigation_main',
        'neatline_globals',
        'neatline_presenters',
        'neatline_styles'
    );


    /**
     * Register a taggable style attribute.
     *
     * @param string $name The column name.
     * @param string $type The column definition.
     */
    public static function addStyle($name, $type)
    {

        $_db = get_db();

        try {

            // Add column to records table.
            $sql = "ALTER TABLE `{$_db->prefix}neatline_records`
                    ADD COLUMN {$name} {$type}";
            $_db->query($sql);

        } catch (Exception $e) {}

    }


    /**
     * Create tables.
     */
    public function hookInstall()
    {

        // Exhibits table.
        // ---------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_exhibits` (
            `id`                INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `added`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`          TIMESTAMP NULL,
            `base_layers`       TEXT NULL,
            `base_layer`        VARCHAR(100) NULL,
            `title`             TEXT NULL,
            `slug`              VARCHAR(100) NOT NULL,
            `description`       TEXT NULL,
            `public`            TINYINT(1) NOT NULL,
            `styles`            TEXT NULL,
            `map_focus`         VARCHAR(100) NULL,
            `map_zoom`          INT(10) UNSIGNED NULL,
             PRIMARY KEY        (`id`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Records table.
        // --------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_records` (
            `id`                INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `item_id`           INT(10) UNSIGNED NULL,
            `exhibit_id`        INT(10) UNSIGNED NULL,
            `added`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`          TIMESTAMP NULL,
            `title`             MEDIUMTEXT NULL,
            `_title`            MEDIUMTEXT NULL,
            `body`              MEDIUMTEXT NULL,
            `_body`             MEDIUMTEXT NULL,
            `coverage`          GEOMETRY NOT NULL,
            `tags`              TEXT NULL,
             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`_title`, `_body`),
             SPATIAL INDEX      (`coverage`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Add styles.
        // -----------
        self::addStyle('presenter',         'VARCHAR(100) NULL');
        self::addStyle('vector_color',      'TINYTEXT NULL');
        self::addStyle('stroke_color',      'TINYTEXT NULL');
        self::addStyle('select_color',      'TINYTEXT NULL');
        self::addStyle('point_image',       'TINYTEXT NULL');
        self::addStyle('vector_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('select_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('stroke_opacity',    'INT(10) UNSIGNED NULL');
        self::addStyle('image_opacity',     'INT(10) UNSIGNED NULL');
        self::addStyle('stroke_width',      'INT(10) UNSIGNED NULL');
        self::addStyle('point_radius',      'INT(10) UNSIGNED NULL');
        self::addStyle('max_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('min_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('map_zoom',          'INT(10) UNSIGNED NULL');
        self::addStyle('map_focus',         'VARCHAR(100) NULL');

    }


    /**
     * Drop tables.
     */
    public function hookUninstall()
    {

        // Drop the exhibits table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_exhibits`";
        $this->_db->query($sql);

        // Drop the data table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_records`";
        $this->_db->query($sql);

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
     * Propagate item changes to Neatline records.
     */
    public function hookAfterSaveItem($args)
    {
        $records = $this->_db->getTable('NeatlineRecord');
        $records->syncItem($args['record']);
    }


    /**
     * Add link to main admin menu bar.
     *
     * @param array $tabs Array of label => URI pairs.
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
     * @param array $exhibit The exhibit.
     * @param array $args Array of arguments, with `exhibit` key.
     * @return array The modified array.
     */
    public function filterNeatlineGlobals($globals, $args)
    {
        $exhibit = $args['exhibit'];
        $globals = array_merge($globals, _nl_exhibitGlobals($exhibit));
        $globals = array_merge($globals, _nl_editorGlobals($exhibit));
        return $globals;
    }


    /**
     * Register record presenters.
     *
     * @param array $presenters Array of presenter name => ids.
     * @return array The modified array.
     */
    public function filterNeatlinePresenters($presenters)
    {
        return array_merge($presenters, array(
            'None'          => 'None',
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
            'presenter',
            'vector_color',
            'stroke_color',
            'select_color',
            'vector_opacity',
            'select_opacity',
            'stroke_opacity',
            'image_opacity',
            'stroke_width',
            'point_radius',
            'point_image',
            'min_zoom',
            'max_zoom',
            'map_focus',
            'map_zoom'
        ));
    }


}
