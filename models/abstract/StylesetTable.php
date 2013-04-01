<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Table class for Neatline data records.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_AbstractStylesetTable extends Omeka_Db_Table
{


    /**
     * Try to fetch an existing styleset for a record. If one does not
     * exist, create a new one.
     *
     * @param NeatlineRecord $record The parent record.
     */
    public function getOrCreate($record)
    {
        // TODO
    }


}
