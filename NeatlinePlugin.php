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


    protected $_hooks = array(
        'install',
        'uninstall',
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
     * Add a column to a table.
     *
     * @param string $table The table name.
     * @param string $name The column name.
     * @param string $type The column definition.
     */
    private static function addField($table, $name, $type)
    {

        $_db = get_db();
        $table = $_db->prefix.$table;

        try {
            $sql = "ALTER TABLE `{$table}` ADD COLUMN {$name} {$type}";
            $_db->query($sql);
        } catch (Exception $e) {}

    }


    /**
     * Remove a column from a table.
     *
     * @param string $table The table name.
     * @param string $name The column name.
     */
    private static function dropField($table, $name)
    {

        $_db = get_db();
        $table = $_db->prefix.$table;

        try {
            $sql = "ALTER TABLE `{$table}` DROP COLUMN {$name}";
            $_db->query($sql);
        } catch (Exception $e) {}

    }


    /**
     * Add a column to the exhibits table.
     *
     * @param string $name The column name.
     * @param string $type The column definition.
     */
    public static function addExhibitField($name, $type)
    {
        self::addField('neatline_exhibits', $name, $type);
    }


    /**
     * Remove a column from the exhibits table.
     *
     * @param string $name The column name.
     */
    public static function dropExhibitField($name)
    {
        self::dropField('neatline_exhibits', $name);
    }


    /**
     * Add a column to the records table.
     *
     * @param string $name The column name.
     * @param string $type The column definition.
     */
    public static function addRecordField($name, $type)
    {
        self::addField('neatline_records', $name, $type);
    }


    /**
     * Remove a column from the records table.
     *
     * @param string $name The column name.
     */
    public static function dropRecordField($name)
    {
        self::dropField('neatline_records', $name);
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
            `widgets`           TEXT NULL,
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
            `body`              MEDIUMTEXT NULL,
            `coverage`          GEOMETRY NOT NULL,
            `tags`              TEXT NULL,
             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`title`, `body`),
             SPATIAL INDEX      (`coverage`)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Add styles.
        // -----------
        self::addRecordField('presenter',       'VARCHAR(100) NULL');
        self::addRecordField('fill_color',      'TINYTEXT NULL');
        self::addRecordField('select_color',    'TINYTEXT NULL');
        self::addRecordField('stroke_color',    'TINYTEXT NULL');
        self::addRecordField('point_image',     'TINYTEXT NULL');
        self::addRecordField('fill_opacity',    'INT(10) UNSIGNED NULL');
        self::addRecordField('select_opacity',  'INT(10) UNSIGNED NULL');
        self::addRecordField('stroke_opacity',  'INT(10) UNSIGNED NULL');
        self::addRecordField('stroke_width',    'INT(10) UNSIGNED NULL');
        self::addRecordField('point_radius',    'INT(10) UNSIGNED NULL');
        self::addRecordField('max_zoom',        'INT(10) UNSIGNED NULL');
        self::addRecordField('min_zoom',        'INT(10) UNSIGNED NULL');
        self::addRecordField('map_zoom',        'INT(10) UNSIGNED NULL');
        self::addRecordField('map_focus',       'VARCHAR(100) NULL');

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
     * @param array $globals The array of properties.
     * @param array $args Array of arguments, with `exhibit`.
     * @return array The modified array.
     */
    public function filterNeatlineGlobals($globals, $args)
    {
        $globals = array_merge($globals,
            _nl_exhibitGlobals($args['exhibit'])
        );
        $globals = array_merge($globals,
            _nl_editorGlobals($args['exhibit'])
        );
        return $globals;
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
            'fill_color',
            'select_color',
            'stroke_color',
            'fill_opacity',
            'stroke_opacity',
            'select_opacity',
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
