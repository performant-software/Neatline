<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_ExpansionTable extends Omeka_Db_Table
{


    /**
     * Try to get an existing expansion row for a parent record. If one
     * doesn't exist, create a new one.
     *
     * @return Neatline_AbstractRow $parent The parent record.
     */
    public function getOrCreate($parent)
    {

        $class = $this->_target;

        // Query for existing row.
        $expansion = $this->findBySql(
            'parent_id=?', array($parent->id), true
        );

        // If one exists, return it; if not, create one.
        return $expansion ? $expansion : new $class($parent);

    }


}
