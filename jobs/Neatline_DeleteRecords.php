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

        // Get child records.
        $records = $this->_db->getTable('NeatlineRecord')->findBySql(
            'exhibit_id=?', array($this->_options['exhibit_id'])
        );

        // Delete.
        foreach ($records as $record) $record->delete();

    }


}
