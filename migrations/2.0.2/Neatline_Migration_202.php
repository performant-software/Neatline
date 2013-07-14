<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_202 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.0.2`.
     */
    public function migrate()
    {
        $this->_renameExhibitQueryColumn();
        $this->_addRecordSpatialQueryingColumn();
        $this->_addRecordNotNullConstraints();
    }


    /**
     * On exhibits, rename `query` -> `item_query`.
     */
    private function _renameExhibitQueryColumn()
    {
        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        CHANGE COLUMN query item_query TEXT NULL;
SQL;
        $this->db->query($sql);
    }


    /**
     * On records, add `spatial_querying`.
     */
    private function _addRecordSpatialQueryingColumn()
    {
        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD COLUMN spatial_querying TINYINT(1) NOT NULL DEFAULT 1;
SQL;
        $this->db->query($sql);
    }


    /**
     * On records, add NOT NULL constraints to `is_wms` and `is_coverage`.
     */
    private function _addRecordNotNullConstraints()
    {

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE is_wms is_wms TINYINT(1) NOT NULL;
SQL;
        $this->db->query($sql);

        $sql = <<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE is_coverage is_coverage TINYINT(1) NOT NULL;
SQL;
        $this->db->query($sql);

    }


}
