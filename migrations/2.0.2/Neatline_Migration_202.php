<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
        $this->_addExhibitSpatialQueryingColumn();
        $this->_addRecordNotNullConstraints();
    }


    /**
     * On exhibits, rename `query` -> `item_query`.
     */
    private function _renameExhibitQueryColumn()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        CHANGE COLUMN query item_query TEXT NULL;
SQL
);
    }


    /**
     * On exhibits, add `spatial_querying`.
     */
    private function _addExhibitSpatialQueryingColumn()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN spatial_querying TINYINT(1) NOT NULL DEFAULT 1;
SQL
);
    }


    /**
     * On records, add NOT NULL constraints to `is_wms` and `is_coverage`.
     */
    private function _addRecordNotNullConstraints()
    {

        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE is_wms is_wms TINYINT(1) NOT NULL;
SQL
);

        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        CHANGE is_coverage is_coverage TINYINT(1) NOT NULL;
SQL
);

    }


}
