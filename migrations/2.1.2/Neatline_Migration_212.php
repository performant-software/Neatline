<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_212 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.1.2`.
     */
    public function migrate()
    {
        $this->_addZoomLevelsColumn();
    }


    /**
     * Add `zoom_levels` column to the exhibit models.
     */
    private function _addZoomLevelsColumn()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN zoom_levels SMALLINT UNSIGNED NULL DEFAULT 20;
SQL
);
    }


}
