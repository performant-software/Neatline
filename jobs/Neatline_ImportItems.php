<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_ImportItems extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {

        nl_setView(); // Mock the view.

        // Manually set the base web directory passed from the controller
        // action. This ensures that links to file attachments will point
        // to the web-accessible locations, not to the local filesystem.
        nl_setWebDir($this->_options['web_dir']);

        // Get application tables.
        $__exhibits = $this->_db->getTable('NeatlineExhibit');
        $__records  = $this->_db->getTable('NeatlineRecord');

        // Load exhibit, query items.
        $exhibit = $__exhibits->find($this->_options['exhibit_id']);
        $items = get_records('Item', $this->_options['query'], 100000);

        foreach ($items as $item) {

            // Try to find a record.
            $record = $__records->findBySql('exhibit_id=? && item_id=?',
                array($exhibit->id, $item->id), true
            );

            // Otherwise, create one.
            if (!$record) {
                $record = new NeatlineRecord($exhibit, $item);
                $record->added = $item->added;
            }

            $record->save();

        }

    }


}
