<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_252 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.5.2`.
     */
    public function migrate()
    {

        $this->_backupExhibitsTable('252');

        $this->_addExhibitAccessibleURLField();

    }


    /**
     * Add `accessible_url` field to the exhibit model.
     */
    private function _addExhibitAccessibleURLField()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN accessible_url TEXT NULL;
SQL
);
    }


}
