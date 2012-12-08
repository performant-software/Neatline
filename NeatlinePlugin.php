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
        'before_delete_item',
        'initialize'
    );

    // Filters.
    protected $_filters = array(
        'admin_navigation_main'
    );

    // Layers.
    public static $_baseLayers = array(
        'OpenStreetMap',
        'Google Physical',
        'Google Streets',
        'Google Hybrid',
        'Google Satellite',
        'Stamen Watercolor',
        'Stamen Toner',
        'Stamen Terrain'
    );


    // ------
    // Hooks.
    // ------


    /**
     * Create tables.
     */
    public function hookInstall()
    {

        // Exhibits table.
        // ---------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_exhibits` (

            `id`                int(10) unsigned NOT NULL auto_increment,
            `added`             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`          TIMESTAMP NULL,
            `title`             tinytext collate utf8_unicode_ci,
            `description`       TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
            `slug`              varchar(100) NOT NULL,
            `public`            tinyint(1) NOT NULL,
            `query`             TEXT COLLATE utf8_unicode_ci NULL,
            `creator_id`        int(10) unsigned NOT NULL,
            `image_id`          int(10) unsigned NULL,
            `map_focus`         varchar(100) NULL,
            `map_zoom`          int(10) unsigned NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Records table.
        // --------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_records` (

            `id`                int(10) unsigned NOT NULL auto_increment,
            `item_id`           int(10) unsigned NULL,
            `exhibit_id`        int(10) unsigned NULL,
            `title`             mediumtext COLLATE utf8_unicode_ci NULL,
            `body`              mediumtext COLLATE utf8_unicode_ci NULL,
            `coverage`          GEOMETRY,
            `map_active`        tinyint(1) NULL,
            `map_focus`         varchar(100) NULL,
            `map_zoom`          int(10) unsigned NULL,

             PRIMARY KEY        (`id`),
             FULLTEXT KEY       (`title`, `slug`, `body`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Tags table.
        // -----------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_tags` (

            `id`                int(10) unsigned NOT NULL auto_increment,
            `exhibit_id`        int(10) unsigned NULL,
            `is_default`        tinyint(1) NULL,
            `tag`               tinytext COLLATE utf8_unicode_ci NULL,
            `vector_color`      tinytext COLLATE utf8_unicode_ci NULL,
            `stroke_color`      tinytext COLLATE utf8_unicode_ci NULL,
            `select_color`      tinytext COLLATE utf8_unicode_ci NULL,
            `vector_opacity`    int(10) unsigned NULL,
            `select_opacity`    int(10) unsigned NULL,
            `stroke_opacity`    int(10) unsigned NULL,
            `image_opacity`     int(10) unsigned NULL,
            `stroke_width`      int(10) unsigned NULL,
            `point_radius`      int(10) unsigned NULL,
            `point_image`       tinytext COLLATE utf8_unicode_ci NULL,
            `max_zoom`          int(10) unsigned NULL,
            `min_zoom`          int(10) unsigned NULL,

             PRIMARY KEY        (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Layers table.
        // -------------
        $sql = "CREATE TABLE IF NOT EXISTS
            `{$this->_db->prefix}neatline_layers` (

            `id`                int(10) unsigned not null auto_increment,
            `name`              tinytext COLLATE utf8_unicode_ci NULL,

            PRIMARY KEY         (`id`)

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci";

        $this->_db->query($sql);


        // Install base layers.
        foreach (self::$_baseLayers as $baseLayer) {
            $layer = new NeatlineLayer;
            $layer->name = $baseLayer;
            $layer->save();
        }

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

        // Drop the data table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_layers`";
        $this->_db->query($sql);

        // Drop the tags table.
        $sql = "DROP TABLE IF EXISTS
            `{$this->_db->prefix}neatline_tags`";
        $this->_db->query($sql);

        // Remove default map style attributes.
        foreach ($this->_mapStyles as $style) delete_option($style);

    }


    /**
     * Register routes.
     *
     * @param array $args Array of hook parameters, with 'router' key.
     */
    public function hookDefineRoutes($args)
    {
        $args['router']->addConfig(new Zend_Config_Ini(
            NEATLINE_PLUGIN_DIR . '/routes.ini', 'routes'));
    }


    /**
     * Add translation source.
     */
    public function hookInitialize()
    {
        add_translation_source(dirname(__FILE__) . '/languages');
    }


    /**
     * Delete data records associated with items that are deleted.
     *
     * @param Omeka_Item $item The item being deleted.
     **/
    public function hookBeforeDeleteItem($args)
    {

        // Prepare the select.
        $table =    $this->_db->getTable('NeatlineRecord');
        $alias =    $table->getTableAlias();
        $adapter =  $table->getAdapter();
        $select =   $table->getSelect();

        // Form select.
        $select->where($adapter->quoteInto(
            "$alias.item_id=?", $args['record']->id)
        );

        // Start transaction.
        $this->_db->beginTransaction();

        try {

            // Delete the records.
            $records = $table->fetchObjects($select);
            foreach ($records as $record) { $record->delete(); }
            $this->_db->commit();

        } catch (Exception $e) {
            $this->_db->rollback();
            throw $e;
        }

    }


    // --------
    // Filters.
    // --------


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
