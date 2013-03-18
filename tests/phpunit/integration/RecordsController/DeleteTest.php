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

class RecordsControllerTest_Delete extends Neatline_TestCase
{


    /**
     * DELETE should remove a record.
     */
    public function testDelete()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);

        $this->request->setMethod('DELETE');

        $c1 = $this->__records->count();
        $this->dispatch('neatline/records/'.$record2->id);
        $c2 = $this->__records->count();

        // Should delete a record.
        $this->assertEquals($c2, $c1-1);

        // Should delete the correct record.
        $this->assertNull($this->__records->find($record2->id));
        $this->assertNotNull($this->__records->find($record1->id));

    }


}
