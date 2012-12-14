<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `save()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Save
    extends Neatline_Test_AppTestCase
{


    /**
     * save() should update the coverage if a WKT string is passed.
     */
    public function testSetCoverage()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);

        // Set coverage.
        $record->save('GEOMETRYCOLLECTION(
            POLYGON((0 0,0 4,4 4,4 0,0 0)))');

        // Re-get, check for set coverage.
        $record = $this->_recordsTable->find($record->id);
        $this->assertNotNull($record->coverage);

    }


}
