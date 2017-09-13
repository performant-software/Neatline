<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_260 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.6.0`.
     */
    public function migrate()
    {
        $this->_backupExhibitsTable('260');

        $this->_addZoomExtentLimitFields();
    }


    /**
     * Add `map_restricted_extent`, `map_min_zoom`, and `map_max_zoom` fields to the exhibit model.
     */
    private function _addZoomExtentLimitFields()
    {
        $this->db->query(<<<SQL
        ALTER TABLE {$this->db->prefix}neatline_exhibits
        ADD COLUMN map_restricted_extent TEXT NULL,
        ADD COLUMN map_min_zoom SMALLINT UNSIGNED NULL,
        ADD COLUMN map_max_zoom SMALLINT UNSIGNED NULL;
SQL
);
    }


}

?>
