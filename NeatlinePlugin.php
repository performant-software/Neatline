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
     * Register a taggable attribute.
     *
     * @param string $attribute The attribute name.
     * @param string $type The column definition.
     */
    public static function addStyle($attribute, $type)
    {

        $_db = get_db();

        try {

            // Records table.
            $sql = "ALTER TABLE `{$_db->prefix}neatline_records`
                    ADD COLUMN _{$attribute} {$type}";
            $_db->query($sql);

            // Tags table.
            $sql = "ALTER TABLE `{$_db->prefix}neatline_tags`
                    ADD COLUMN _{$attribute} TINYINT(1) DEFAULT 0";
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
            `tag_id`            INT(10) UNSIGNED NULL,

            `added`             TIMESTAMP NULL,
            `modified`          TIMESTAMP NULL,
            `title`             TINYTEXT COLLATE utf8_unicode_ci NULL,
            `description`       TEXT COLLATE utf8_unicode_ci NULL,
            `slug`              VARCHAR(100) NOT NULL,
            `public`            TINYINT(1) NOT NULL,
            `query`             TEXT COLLATE utf8_unicode_ci NULL,
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
            `tag_id`            INT(10) UNSIGNED NULL,

            `slug`              VARCHAR(100) NULL,
            `title`             MEDIUMTEXT COLLATE utf8_unicode_ci NULL,
            `body`              MEDIUMTEXT COLLATE utf8_unicode_ci NULL,
            `tags`              TEXT COLLATE utf8_unicode_ci NULL,
            `coverage`          GEOMETRY NOT NULL,
            `map_active`        TINYINT(1) NULL,
            `map_focus`         VARCHAR(100) NULL,
            `map_zoom`          INT(10) UNSIGNED NULL,

             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`title`, `slug`, `body`),
             SPATIAL INDEX      (`coverage`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Tags table.
        // -----------

        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_tags` (

            `id`                INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
            `exhibit_id`        INT(10) UNSIGNED NOT NULL,
            `tag`               TINYTEXT COLLATE utf8_unicode_ci NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Add styles.
        // -----------

        $text   = 'TINYTEXT COLLATE utf8_unicode_ci NULL';
        $int    = 'INT(10) UNSIGNED NULL';

        self::addStyle('vector_color',      $text);
        self::addStyle('stroke_color',      $text);
        self::addStyle('select_color',      $text);
        self::addStyle('point_image',       $text);
        self::addStyle('vector_opacity',    $int);
        self::addStyle('select_opacity',    $int);
        self::addStyle('stroke_opacity',    $int);
        self::addStyle('image_opacity',     $int);
        self::addStyle('stroke_width',      $int);
        self::addStyle('point_radius',      $int);
        self::addStyle('max_zoom',          $int);
        self::addStyle('min_zoom',          $int);


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

        // Drop the tags table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_tags`";
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
            NEATLINE_PLUGIN_DIR . '/routes.ini', 'routes')
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
     * Add link to main admin menu bar.
     *
     * @param array $styles Array taggable styles.
     * @return array The modified style array.
     */
    public function filterNeatlineStyles($styles)
    {
        return array_merge($styles, array(
            'vector_color',
            'stroke_color',
            'select_color',
            'point_image',
            'vector_opacity',
            'select_opacity',
            'stroke_opacity',
            'image_opacity',
            'stroke_width',
            'point_radius',
            'max_zoom',
            'min_zoom'
        ));
    }


}
