<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Item import job.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Job_ItemImporter extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     * TODO|dev
     */
    public function perform()
    {

        _nl_mockView();

        // Load the exhibit.
        $exhibit = $this->_db->getTable('NeatlineExhibit')->find(
            $this->_options['exhibit_id']
        );

        // Create records.
        foreach (get_records('Item', array(), 1000) as $item) {
            $record = new NeatlineRecord($exhibit, $item);
            $record->save();
        }

    }


}
