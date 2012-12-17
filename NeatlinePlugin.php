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
        'admin_navigation_main'
    );


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

            `vector_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `stroke_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `select_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `vector_opacity`    INT(10) UNSIGNED NULL,
            `select_opacity`    INT(10) UNSIGNED NULL,
            `stroke_opacity`    INT(10) UNSIGNED NULL,
            `image_opacity`     INT(10) UNSIGNED NULL,
            `stroke_width`      INT(10) UNSIGNED NULL,
            `point_radius`      INT(10) UNSIGNED NULL,
            `point_image`       TINYTEXT COLLATE utf8_unicode_ci NULL,
            `max_zoom`          INT(10) UNSIGNED NULL,
            `min_zoom`          INT(10) UNSIGNED NULL,

            `_vector_color`     INT(10) UNSIGNED NULL,
            `_stroke_color`     INT(10) UNSIGNED NULL,
            `_select_color`     INT(10) UNSIGNED NULL,
            `_vector_opacity`   INT(10) UNSIGNED NULL,
            `_select_opacity`   INT(10) UNSIGNED NULL,
            `_stroke_opacity`   INT(10) UNSIGNED NULL,
            `_image_opacity`    INT(10) UNSIGNED NULL,
            `_stroke_width`     INT(10) UNSIGNED NULL,
            `_point_radius`     INT(10) UNSIGNED NULL,
            `_point_image`      INT(10) UNSIGNED NULL,
            `_max_zoom`         INT(10) UNSIGNED NULL,
            `_min_zoom`         INT(10) UNSIGNED NULL,

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

            `vector_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `stroke_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `select_color`      TINYTEXT COLLATE utf8_unicode_ci NULL,
            `vector_opacity`    INT(10) UNSIGNED NULL,
            `select_opacity`    INT(10) UNSIGNED NULL,
            `stroke_opacity`    INT(10) UNSIGNED NULL,
            `image_opacity`     INT(10) UNSIGNED NULL,
            `stroke_width`      INT(10) UNSIGNED NULL,
            `point_radius`      INT(10) UNSIGNED NULL,
            `point_image`       TINYTEXT COLLATE utf8_unicode_ci NULL,
            `max_zoom`          INT(10) UNSIGNED NULL,
            `min_zoom`          INT(10) UNSIGNED NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


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


}
