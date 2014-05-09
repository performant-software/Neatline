<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Job_ImportItems extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {

        $_records  = $this->_db->getTable('NeatlineRecord');
        $_exhibits = $this->_db->getTable('NeatlineExhibit');
        $_items    = $this->_db->getTable('Item');

        // Load the exhibit, alias the query.
        $exhibit = $_exhibits->find($this->_options['exhibit_id']);
        $query = $this->_options['query'];

        $i = 0;
        while ($items = $_items->findBy($query, 10, $i)) {
            foreach ($items as $item) {

                // Try to find an existing record.
                $record = $_records->findBySql('exhibit_id=? && item_id=?',
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
