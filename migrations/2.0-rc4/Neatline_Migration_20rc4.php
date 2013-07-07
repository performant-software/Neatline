<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_20rc4 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.0-rc4`.
     */
    public function migrate()
    {
        $this->_renameExhibitBaseLayerColumns();
        $this->_addExhibitImageBaseLayerColumns();
        $this->_addExhibitWmsBaseLayerColumns();
        $this->_changeRecordWmsLayerColumnTypes();
    }


    /**
     * On exhibits, rename `base_layer(s)` -> `spatial_layer(s)`.
     */
    private function _renameExhibitBaseLayerColumns()
    {

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        CHANGE COLUMN base_layers spatial_layers TEXT NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        CHANGE COLUMN base_layer spatial_layer TEXT NULL;
SQL;
        $this->db->query($sql);

    }


    /**
     * On exhibits, add `image_layer`, `image_height`, and `image_width`.
     */
    private function _addExhibitImageBaseLayerColumns()
    {

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN image_layer TEXT NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN image_height SMALLINT UNSIGNED NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN image_width SMALLINT UNSIGNED NULL;
SQL;
        $this->db->query($sql);

    }


    /**
     * On exhibits, add `wms_address` and `wms_layers`.
     */
    private function _addExhibitWmsBaseLayerColumns()
    {

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN wms_address TEXT NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN wms_layers TEXT NULL;
SQL;
        $this->db->query($sql);

    }


    /**
     * On records, change `wms_address` and `wms_layers` to TEXT NULL.
     */
    private function _changeRecordWmsLayerColumnTypes()
    {

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE wms_address wms_address TEXT NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE wms_layers wms_layers TEXT NULL;
SQL;
        $this->db->query($sql);

    }


}
