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
        'define_routes',
        'initialize'
    );


    // Filters.
    protected $_filters = array(
        'admin_navigation_main',
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

            `title`             TINYTEXT NULL,
            `description`       TEXT NULL,
            `slug`              VARCHAR(100) NOT NULL,
            `public`            TINYINT(1) NOT NULL,
            `query`             TEXT NULL,
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
            `slug`              VARCHAR(100) NULL,

             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`title`, `slug`, `body`),
             SPATIAL INDEX      (`coverage`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Add styles.
        // -----------
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
     * Register routes.
     *
     * @param array $args Array of hook parameters, with 'router' key.
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NL_DIR . '/routes.ini', 'routes')
        );
    }


    /**
     * Add translation source.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
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
     * Register the taggable styles.
     *
     * @param array $styles Array of column name => label pairs.
     * @return array The updated array.
     */
    public function filterNeatlineStyles($styles)
    {
        return array_merge($styles, array(

            'vector_color'      => 'Shape Color',
            'stroke_color'      => 'Line Color',
            'select_color'      => 'Selected Color',
            'vector_opacity'    => 'Shape Opacity',
            'select_opacity'    => 'Selected Opacity',
            'stroke_opacity'    => 'Line Opacity',
            'image_opacity'     => 'Image Opacity',
            'stroke_width'      => 'Line Width',
            'point_radius'      => 'Point Radius',
            'point_image'       => 'Point Image',
            'min_zoom'          => 'Min Zoom',
            'max_zoom'          => 'Max Zoom',
            'map_focus'         => 'Focus Coordinates',
            'map_zoom'          => 'Focus Zoom'

        ));
    }


}
