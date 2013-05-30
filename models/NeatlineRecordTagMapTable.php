<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTagMapTable extends Neatline_Table_Map
{


    /**
     * Get the associated tag table.
     *
     * @return Neatline_Table_Tag The tag table.
     */
    public function getTagTable()
    {
        return $this->getTable('NeatlineRecordTag');
    }


}
