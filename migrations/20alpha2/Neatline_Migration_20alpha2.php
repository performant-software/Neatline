<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Migration_20alpha2 extends Neatline_Migration_Abstract
{


    /**
     * Migrate to `2.0-alpha2`.
     */
    public function migrate()
    {
        $this->_changeExhibitsTableEngine();
        $this->_addUserIdColumns();
    }


    /**
     * Change the `ENGINE` on the exhibits table to `InnoDB`.
     */
    private function _changeExhibitsTableEngine()
    {
        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            ENGINE=InnoDB"
        );
    }


    /**
     * Add `user_id` columns to the exhibit and record models.
     */
    private function _addUserIdColumns()
    {

        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_exhibits`
            ADD COLUMN `user_id` INT(10) UNSIGNED NOT NULL DEFAULT 0"
        );

        $this->_db->query(
            "ALTER TABLE `{$this->_db->prefix}neatline_records`
            ADD COLUMN `user_id` INT(10) UNSIGNED NOT NULL DEFAULT 0"
        );

    }


}
