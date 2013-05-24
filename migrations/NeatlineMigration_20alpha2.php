<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlineMigration_20alpha2 extends NeatlineMigration_Abstract
{


    /**
     * Migrate to 2.0-alpha2.
     */
    public function migrate()
    {
        $this->addUserIdColumns();
    }


    /**
     * Add `user_id` columns to the exhibit and record tables.
     */
    protected function addUserIdColumns()
    {
        // TODO
    }


}
