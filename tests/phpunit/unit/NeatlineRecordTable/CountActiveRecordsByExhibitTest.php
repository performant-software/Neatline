<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `countActiveRecordsByExhibit` on `NeatlineRecordTable`.
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
     * `countActiveRecordsByExhibit` should number of map-active records
     * in the exhibit.
     */
    public function testCountActiveRecordsByExhibit()
    {
        $exhibit1 = $this->__exhibit('test-1');
        $exhibit2 = $this->__exhibit('test-2');
        $record1  = $this->__record($exhibit1);
        $record2  = $this->__record($exhibit2);
        $record3  = $this->__record($exhibit2);
        $this->assertEquals($exhibit1->getNumberOfRecords(), 1);
        $this->assertEquals($exhibit2->getNumberOfRecords(), 2);
    }


}
