<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_243 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.4.3`.
     */
    public function migrate()
    {

        $this->_backupRecordsTable('243');
        $this->_indexItemTitleField();

    }


    /**
     * Add `item_title` field to the record model.
     */
    private function _indexItemTitleField()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD FULLTEXT (item_title, title, body, slug);
SQL
);
    }

}
