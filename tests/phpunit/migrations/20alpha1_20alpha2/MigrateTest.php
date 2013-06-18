<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class v20alpha1_v20alpha2Test_Migrate extends Neatline_Case_Default
{


    /**
     * Restore the 2.0-alpha1 schema, migrate to 2.0-alphpa2.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_clearSchema();
        $this->_createSchema();
        $this->_migrate();
    }


    /**
     * Reinstall the current schema.
     */
    public function tearDown()
    {
        $this->_clearSchema();
    }


    /**
     * Drop Neatline tables.
     */
    private function _clearSchema()
    {
        $this->db->query("DROP TABLE IF EXISTS
            `{$this->__exhibits->getTableName()}`"
        );
        $this->db->query("DROP TABLE IF EXISTS
            `{$this->__records->getTableName()}`"
        );
    }


    /**
     * Install 2.0-alpha1 schema.
     */
    private function _createSchema()
    {

        // Copied from 3fd48a3f0fcc44fd5c01672d401908e7a91ab265.

        $this->db->query("CREATE TABLE IF NOT EXISTS
        `{$this->db->prefix}neatline_exhibits` (

        `id`                    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `added`                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `modified`              TIMESTAMP NULL,
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

        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci");

        $this->db->query("CREATE TABLE IF NOT EXISTS
        `{$this->db->prefix}neatline_records` (

        `id`                    INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        `item_id`               INT(10) UNSIGNED NULL,
        `exhibit_id`            INT(10) UNSIGNED NULL,
        `added`                 TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `modified`              TIMESTAMP NULL,
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
     * Run 2.0-alpha1 -> 2.0-alpha2 migration.
     */
    private function _migrate()
    {
        $plugin = new NeatlinePlugin();
        $plugin->hookUpgrade('2.0-alpha1', '2.0-alpha2');
    }


    /**
     * The exhibits table engine should be changed to InnoDB.
     */
    public function testChangeExhibitsTableEngine()
    {
        // TODO
    }


    /**
     * A `user_id` column should be added to the exhibits/records tables.
     */
    public function testAddUserIdColumns()
    {
        // TODO
    }


}
