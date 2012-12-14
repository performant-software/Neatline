<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `countActiveRecordsByExhibit()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_CountActiveRecordsByExhibit
    extends Neatline_Test_AppTestCase
{


    /**
     * countActiveRecordsByExhibit() should number of map-active records
     * in the exhibit.
     */
    public function testCountActiveRecordsByExhibit()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit('test-1');
        $exhibit2 = $this->__exhibit('test-2');

        // Create records.
        $record1 = new NeatlineRecord($exhibit1);
        $record2 = new NeatlineRecord($exhibit1);
        $record3 = new NeatlineRecord($exhibit1);
        $record4 = new NeatlineRecord($exhibit2);
        $record5 = new NeatlineRecord($exhibit2);
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record3->map_active = 1;
        $record4->map_active = 1;
        $record5->map_active = 0;
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();
        $record5->save();

        // Check count.
        $this->assertEquals($exhibit1->getNumberOfRecords(), 3);
        $this->assertEquals($exhibit2->getNumberOfRecords(), 1);

    }


}
