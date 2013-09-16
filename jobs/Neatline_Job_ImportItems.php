<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Job_ImportItems extends Neatline_Job_MockView
{


    /**
     * Import Omeka items.
     */
    public function execute()
    {

        $__records  = $this->_db->getTable('NeatlineRecord');
        $__exhibits = $this->_db->getTable('NeatlineExhibit');
        $__items    = $this->_db->getTable('Item');

        // Load the exhibit, alias the query.
        $exhibit = $__exhibits->find($this->_options['exhibit_id']);
        $query = $this->_options['query'];

        $i = 0;
        while ($items = $__items->findBy($query, 10, $i)) {
            foreach ($items as $item) {

                // Try to find an existing record.
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
            $i++;
        }

    }


}
