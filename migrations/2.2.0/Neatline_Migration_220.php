<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_220 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.2.0`.
     */
    public function migrate()
    {

        $this->_backupRecordsTable('220');

        $this->_addItemTitleField();
        $this->_copyItemTitles();
        $this->_unsetRecordFields();

    }


    /**
     * Add `item_title` field to the record model.
     */
    private function _addItemTitleField()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_records
        ADD COLUMN item_title MEDIUMTEXT NULL;
SQL
);
    }


    /**
     * For records that have parent items, copy the value of the `title` field
     * into the new `item_title` field.
     */
    private function _copyItemTitles()
    {
        $this->db->query(<<<SQL
        UPDATE {$this->db->prefix}neatline_records
        SET item_title = title
        WHERE item_id IS NOT NULL;
SQL
);
    }


    /**
     * For records that have parent items, clear out the old, compiled values
     * of the Neatline-local `title` and `body` fields.
     */
    private function _unsetRecordFields()
    {
        $this->db->query(<<<SQL
        UPDATE {$this->db->prefix}neatline_records
        SET title = NULL, body = NULL
        WHERE item_id IS NOT NULL;
SQL
);
    }


}
