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


}
