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

        _nl_setView();

        // Load the exhibit.
        $exhibit = $this->_db->getTable('NeatlineExhibit')->find(
            $this->_options['exhibit_id']
        );

        // Query for items.
        $items = get_records('Item', $this->_options['query'], 100000);

        // Create records.
        foreach ($items as $item) {
            $record = new NeatlineRecord($exhibit, $item);
            $record->save();
        }

    }


}
