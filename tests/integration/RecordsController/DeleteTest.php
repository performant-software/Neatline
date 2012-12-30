<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for DELETE action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Delete
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * DELETE should remove a record.
     * --------------------------------------------------------------------
     */
    public function testDelete()
    {

        // Create exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        // Hit /records with DELETE.
        $c1 = $this->_recordsTable->count();
        $this->request->setMethod('DELETE');
        $this->dispatch('neatline/record/'.$record2->id);
        $c2 = $this->_recordsTable->count();

        // Check code.
        $this->assertResponseCode(200);

        // Check record deleted.
        $this->assertNull($this->_recordsTable->find($record2->id));
        $this->assertEquals($c2, $c1-1);

    }


}
