<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineExhibitTest_DeleteChildRecords extends Neatline_Case_Default
{


    /**
     * `beforeDelete` should delete all child records.
     */
    public function testDeleteChildRecords()
    {

        $exhibit1   = $this->_exhibit();
        $exhibit2   = $this->_exhibit();
        $record1    = $this->_record($exhibit1);
        $record2    = $this->_record($exhibit1);
        $record3    = $this->_record($exhibit2);
        $record4    = $this->_record($exhibit2);

        $exhibit1->delete();

        // Should delete exhibit 1 records.
        $this->assertNull($this->_records->find($record1->id));
        $this->assertNull($this->_records->find($record2->id));

        // Should not delete exhibit 2 records.
        $this->assertNotNull($this->_records->find($record3->id));
        $this->assertNotNull($this->_records->find($record4->id));

    }


}
