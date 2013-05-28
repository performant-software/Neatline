<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Table_Tagging extends Omeka_Db_Table
{


    /**
     * Insert a collection of tags.
     *
     * @param Omeka_Record_AbstractRecord $row The tagged row.
     * @param array $tags A collection of tags.
     */
    public function insertTaggings($row, $tags)
    {
        // TODO
    }


}
