<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Migrate extends Omeka_Job_AbstractJob
{


    /**
     * Migrate installations from 1.1.x -> 2.0.
     */
    public function perform()
    {
        $this->_alterStorageEngines();
        $this->_renameExhibitColumns();
        $this->_renameRecordColumns();
    }


    /**
     * Change storage engines from InnoDB to MyISAM.
     */
    protected function _alterStorageEngines()
    {

        // Exhibits
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            ENGINE = MyISAM
        ");

        // Records
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            ENGINE = MyISAM
        ");

    }


    /**
     * Rename all exhibit columns that have changed name or type.
     */
    protected function _renameExhibitColumns()
    {

        // `name`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            CHANGE `name` `title` TEXT NULL
        ");

        // `description`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            CHANGE `description` `description` TEXT NULL
        ");

        // `query`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            CHANGE `query` `query` TEXT NULL
        ");

    }


    /**
     * Rename all record columns that have changed name or type.
     */
    protected function _renameRecordColumns()
    {

        // `title`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `title` `title` MEDIUMTEXT NULL
        ");

        // `description`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `description` `description` MEDIUMTEXT NULL
        ");

        // `start_date`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `start_date` `start_date` VARCHAR(100) NULL
        ");

        // `end_date`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `end_date` `end_date` VARCHAR(100) NULL
        ");

        // `start_visible_date`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `start_visible_date` `after_date` VARCHAR(100) NULL
        ");

        // `end_visible_date`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `end_visible_date` `before_date` VARCHAR(100) NULL
        ");

        // `vector_color`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `vector_color` `fill_color` VARCHAR(100) NULL
        ");

        // `stroke_color`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `stroke_color` `stroke_color` VARCHAR(100) NULL
        ");

        // `highlight_color`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `highlight_color` `select_color` VARCHAR(100) NULL
        ");

        // `vector_opacity`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `vector_opacity` `fill_opacity` INT(10) UNSIGNED NULL
        ");

        // `point_image`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `point_image` `point_image` VARCHAR(100) NULL
        ");

        // `map_bounds`
        $this->_db->query("
            ALTER TABLE `{$this->_db->prefix}neatline_records`
            CHANGE `map_bounds` `map_focus` VARCHAR(100) NULL
        ");

    }


}
