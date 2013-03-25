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


class ItemImporter extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {

        _nl_setView();

        $__exhibits = $this->_db->getTable('NeatlineExhibit');
        $__records  = $this->_db->getTable('NeatlineRecord');

        // Get exhibit and items.
        $exhibit = $__exhibits->find($this->_options['exhibit_id']);
        $items = get_records('Item', $this->_options['query'], 100000);

        // Create records.
        foreach ($items as $item) {

            // Try to find a record.
            $record = $__records->findBy(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id
            ));

            // Or create a new one.
            if (!$record) $record = new NeatlineRecord($exhibit, $item);
            $record->save();

        }

    }


}
