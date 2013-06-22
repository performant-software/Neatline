<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migrate200 extends Neatline_Case_Default
{


    /**
     * Install the 1.x schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_create1xSchema();
    }


    /**
     * Restore the 2.x schema.
     */
    public function tearDown()
    {
        $this->_create2xSchema();
        parent::tearDown();
    }


    /**
     * Clear the existing 2.x schema.
     */
    protected function _clearSchema()
    {

        $sql1 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_exhibits
SQL;

        $sql3 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_data_records
SQL;

        $sql5 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_records
SQL;

        $sql2 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_exhibits_migrate
SQL;

        $sql4 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_data_records_migrate
SQL;

        $sql6 = <<<SQL
        DROP TABLE {$this->db->prefix}neatline_base_layers_migrate
SQL;

        try { $this->db->query($sql1); } catch (Exception $e) {}
        try { $this->db->query($sql2); } catch (Exception $e) {}
        try { $this->db->query($sql3); } catch (Exception $e) {}
        try { $this->db->query($sql4); } catch (Exception $e) {}
        try { $this->db->query($sql5); } catch (Exception $e) {}
        try { $this->db->query($sql6); } catch (Exception $e) {}

    }


    /**
     * Install the 1.x schema.
     */
    protected function _create1xSchema()
    {

        $this->_clearSchema();

        $this->db->query("CREATE TABLE IF NOT EXISTS `{$this->db->prefix}neatline_exhibits` (

            `id`                            int(10) unsigned not null auto_increment,
            `added`                         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `modified`                      TIMESTAMP NULL,
            `name`                          tinytext collate utf8_unicode_ci,
            `description`                   TEXT COLLATE utf8_unicode_ci DEFAULT NULL,
            `slug`                          varchar(100) NOT NULL,
            `public`                        tinyint(1) NOT NULL,
            `query`                         TEXT COLLATE utf8_unicode_ci NULL,
            `image_id`                      int(10) unsigned NULL,
            `top_element`                   ENUM('map', 'timeline') DEFAULT 'map',
            `items_h_pos`                   ENUM('right', 'left') DEFAULT 'right',
            `items_v_pos`                   ENUM('top', 'bottom') DEFAULT 'bottom',
            `items_height`                  ENUM('full', 'partial') DEFAULT 'partial',
            `is_map`                        tinyint(1) NOT NULL,
            `is_timeline`                   tinyint(1) NOT NULL,
            `is_items`                      tinyint(1) NOT NULL,
            `is_context_band`               tinyint(1) NOT NULL,
            `h_percent`                     int(10) unsigned NULL,
            `v_percent`                     int(10) unsigned NULL,
            `default_map_bounds`            varchar(100) NULL,
            `default_map_zoom`              int(10) unsigned NULL,
            `default_focus_date`            varchar(100) NULL,
            `default_timeline_zoom`         int(10) unsigned NULL,
            `default_vector_color`          tinytext COLLATE utf8_unicode_ci NULL,
            `default_stroke_color`          tinytext COLLATE utf8_unicode_ci NULL,
            `default_highlight_color`       tinytext COLLATE utf8_unicode_ci NULL,
            `default_vector_opacity`        int(10) unsigned NULL,
            `default_select_opacity`        int(10) unsigned NULL,
            `default_stroke_opacity`        int(10) unsigned NULL,
            `default_graphic_opacity`       int(10) unsigned NULL,
            `default_stroke_width`          int(10) unsigned NULL,
            `default_point_radius`          int(10) unsigned NULL,
            `default_base_layer`            int(10) unsigned NULL,
            `default_context_band_unit`     ENUM('hour', 'day', 'week', 'month', 'year', 'decade', 'century') DEFAULT 'decade',
            `default_context_band_height`   int(10) unsigned NULL,
            `creator_id`                    int(10) unsigned NOT NULL,

            PRIMARY KEY (`id`)

        ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");

        $this->db->query("CREATE TABLE IF NOT EXISTS `{$this->db->prefix}neatline_data_records` (

            `id`                    int(10) unsigned not null auto_increment,
            `item_id`               int(10) unsigned NULL,
            `use_dc_metadata`       tinyint(1) NULL,
            `exhibit_id`            int(10) unsigned NULL,
            `parent_record_id`      int(10) unsigned NULL,
            `show_bubble`           tinyint(1) NULL,
            `title`                 mediumtext COLLATE utf8_unicode_ci NULL,
            `slug`                  varchar(100) NULL,
            `description`           mediumtext COLLATE utf8_unicode_ci NULL,
            `start_date`            tinytext COLLATE utf8_unicode_ci NULL,
            `end_date`              tinytext COLLATE utf8_unicode_ci NULL,
            `start_visible_date`    tinytext COLLATE utf8_unicode_ci NULL,
            `end_visible_date`      tinytext COLLATE utf8_unicode_ci NULL,
            `geocoverage`           mediumtext COLLATE utf8_unicode_ci NULL,
            `left_percent`          int(10) unsigned NULL,
            `right_percent`         int(10) unsigned NULL,
            `vector_color`          tinytext COLLATE utf8_unicode_ci NULL,
            `stroke_color`          tinytext COLLATE utf8_unicode_ci NULL,
            `highlight_color`       tinytext COLLATE utf8_unicode_ci NULL,
            `vector_opacity`        int(10) unsigned NULL,
            `select_opacity`        int(10) unsigned NULL,
            `stroke_opacity`        int(10) unsigned NULL,
            `graphic_opacity`       int(10) unsigned NULL,
            `stroke_width`          int(10) unsigned NULL,
            `point_radius`          int(10) unsigned NULL,
            `point_image`           tinytext COLLATE utf8_unicode_ci NULL,
            `space_active`          tinyint(1) NULL,
            `time_active`           tinyint(1) NULL,
            `items_active`          tinyint(1) NULL,
            `display_order`         int(10) unsigned NULL,
            `map_bounds`            varchar(100) NULL,
            `map_zoom`              int(10) unsigned NULL,

             PRIMARY KEY (`id`)

        ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");

        $this->db->query("CREATE TABLE IF NOT EXISTS `{$this->db->prefix}neatline_base_layers` (

            `id`    int(10) unsigned not null auto_increment,
            `name`  tinytext COLLATE utf8_unicode_ci NULL,

             PRIMARY KEY (`id`)

        ) ENGINE=innodb DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");

        $baseLayers = array(
            'OpenStreetMap',
            'Google Physical',
            'Google Streets',
            'Google Hybrid',
            'Google Satellite',
            'Stamen Watercolor',
            'Stamen Toner',
            'Stamen Terrain'
        );

        $table = $this->db->getTable('BaseLayers');
        foreach ($baseLayers as $baseLayer) {
            $table->insert(array('name' => $baseLayer));
        }

        $defaultStyles = array(
            'vector_color'        => '#196aff',
            'stroke_color'        => '#000000',
            'highlight_color'     => '#ff9600',
            'vector_opacity'      => '30',
            'select_opacity'      => '40',
            'stroke_opacity'      => '100',
            'graphic_opacity'     => '80',
            'stroke_width'        => '3',
            'point_radius'        => '6',
            'h_percent'           => '24',
            'v_percent'           => '84',
            'timeline_zoom'       => '15',
            'context_band_unit'   => 'decade',
            'context_band_height' => '35'
        );

        foreach ($defaultStyles as $style => $value) {
          set_option($style, $value);
        }

    }


    /**
     * Install the 2.x schema.
     */
    protected function _create2xSchema()
    {
        $this->_clearSchema();
        $plugin = new NeatlinePlugin();
        $plugin->hookInstall();
    }


    /**
     * Trigger the `upgrade` hook.
     */
    protected function _upgrade()
    {
        $this->helper->pluginBroker->setCurrentPluginDirName('Neatline');
        $this->plugin = new NeatlinePlugin();
        $this->plugin->hookUpgrade('1.1.3', '2.0.0');
    }


    /**
     * Run the migration job.
     */
    protected function _migrate()
    {
        Zend_Registry::get('job_dispatcher')->send(
            'Neatline_Job_UpgradeFrom1x'
        );
    }


    /**
     * Load JSON fixtures.
     *
     * @param string $fixture The fixture file.
     */
    protected function _loadFixture($fixture)
    {

        // Read the file.
        $path = dirname(dirname(__FILE__)).'/fixtures/'.$fixture;
        $json = Zend_Json::decode(file_get_contents($path));

        // `exhibits.json`
        if (strpos($path, 'exhibits.json')) {
            foreach ($json as $row) {
                $this->db->insert('NeatlineExhibit', $row);
            }
        }

        // `records.json`
        if (strpos($path, 'records.json')) {
            foreach ($json as $row) {
                $this->db->insert('NeatlineDataRecord', $row);
            }
        }

    }


    /**
     * Assert that all values for field A on table X are the same as all
     * values for field B on table Y.
     *
     * @param string $f1
     * @param string $f2
     * @param string $t1
     * @param string $t2
     */
    protected function _migration($f1, $f2, $t1, $t2)
    {

        $sql1 = <<<SQL
        SELECT id, $f1 from {$this->db->prefix}$t1;
SQL;

        $sql2 = <<<SQL
        SELECT id, $f2 from {$this->db->prefix}$t2;
SQL;

        $rows1 = $this->db->query($sql1)->fetchAll();
        $rows2 = $this->db->query($sql2)->fetchAll();

        $values1 = array();
        foreach ($rows1 as $row) {
            $values1[$row['id']] = $row[$f1];
        }

        $values2 = array();
        foreach ($rows2 as $row) {
            $values2[$row['id']] = $row[$f2];
        }

        $this->assertEquals($values1, $values2);

    }


    /**
     * Assert that an exhibit field was migrated to the new table.
     *
     * @param string $f1
     * @param string $f2
     */
    protected function _exhibitMigration($f1, $f2)
    {
        $this->_migration(
            $f1, $f2, 'neatline_exhibits_migrate', 'neatline_exhibits'
        );
    }


    /**
     * Assert that a record field was migrated to the new table.
     *
     * @param string $f1
     * @param string $f2
     */
    protected function _recordMigration($f1, $f2)
    {
        $this->_migration(
            $f1, $f2, 'neatline_data_records_migrate', 'neatline_records'
        );
    }


    /**
     * Fetch an exhibit by `title`.
     *
     * @param string $title
     */
    protected function _getExhibitByTitle($title)
    {
        return $this->__exhibits->findBySql(
            'title=?', array($title), true
        );
    }


    /**
     * Fetch a record by `title`.
     *
     * @param string $title
     */
    protected function _getRecordByTitle($title)
    {
        return $this->__records->findBySql(
            'title=?', array($title), true
        );
    }


}
