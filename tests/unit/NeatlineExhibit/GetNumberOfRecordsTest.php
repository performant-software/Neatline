<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getNumberOfRecords()` on NeatlineExhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_GetNumberOfRecords
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * getNumberOfRecords() should return the number of active records.
     * --------------------------------------------------------------------
     */
    public function testGetNumberOfRecords()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create records.
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record3 = new NeatlineRecord($exhibit);
        $record4 = new NeatlineRecord($exhibit);
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record3->map_active = 1;
        $record4->map_active = 0;
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Check count.
        $this->assertEquals($exhibit->getNumberOfRecords(), 3);

    }


}
