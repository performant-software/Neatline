<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_DeleteRecords extends Omeka_Job_AbstractJob
{


    /**
     * Delete all records in an exhibit.
     */
    public function perform()
    {

        $__records = $this->_db->getTable('NeatlineRecord');

        // Select records in 1000-row pages.
        $select = $__records->getSelect()
            ->where('exhibit_id=?', $this->_options['exhibit_id'])
            ->limit(1000);

        // Load and delete records until none remain.
        while (count($records = $__records->fetchObjects($select))) {
            foreach ($records as $record) $record->delete();
        }

    }


}
