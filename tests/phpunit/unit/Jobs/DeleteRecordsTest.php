<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class DeleteRecordsTest extends Neatline_TestCase
{


    /**
     * `Neatline_DeleteRecords` should delete all records in an exhibit.
     */
    public function testDeleteRecords()
    {

        $exhibit1   = $this->__exhibit();
        $exhibit2   = $this->__exhibit();
        $record1    = $this->__record($exhibit1);
        $record2    = $this->__record($exhibit1);
        $record3    = $this->__record($exhibit2);
        $record4    = $this->__record($exhibit2);

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_DeleteRecords', array(
                'exhibit_id' => $exhibit1->id
            )
        );

        // Should delete exhibit 1 records.
        $this->assertNull($this->__records->find($record1->id));
        $this->assertNull($this->__records->find($record2->id));

        // Should not delete exhibit 2 records.
        $this->assertNotNull($this->__records->find($record3->id));
        $this->assertNotNull($this->__records->find($record4->id));

    }


}
