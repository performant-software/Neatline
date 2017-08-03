<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Job_DuplicateRecords extends Omeka_Job_AbstractJob
{


    /**
     * Duplicate an exhibit's records and assign them to a new exhibit.
     */
    public function perform()
    {

        $_records  = $this->_db->getTable('NeatlineRecord');

        $records = $_records->findBy(array('exhibit_id' => $this->_options['exhibit_id']));

        foreach ($records as $record) {
          $recordClone = clone $record;
          $recordClone->exhibit_id = $this->_options['adopting_exhibit_id'];
          $recordClone->added = date('Y-m-d G:i:s');
          if ($this->_options['owner_id']) {
            $recordClone->owner_id = current_user()->id;
          }
          $recordClone->save();
        }
    }


}
