<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `setCoverage()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_SetCoverage
    extends Neatline_Test_AppTestCase
{


    /**
     * setCoverage() should set a GEOMETRYCOLLECTION value.
     */
    public function testSetCoverage()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord(null, $exhibit);
        $record->save();

        // Set coverage.
        $record->setCoverage('GEOMETRYCOLLECTION(
            POLYGON((0 0,0 4,4 4,4 0,0 0)))');

        // Get select for intersecting point.
        $select = $this->_recordsTable->getSelect();
        $select->where(new Zend_Db_Expr('MBRIntersects(
            coverage,GeomFromText("POINT(2 2)"))'));

        // Check match.
        $records = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(1, $records);

        // Get select for non-intersecting point.
        $select = $this->_recordsTable->getSelect();
        $select->where(new Zend_Db_Expr('MBRIntersects(
            coverage,GeomFromText("POINT(5 5)"))'));

        // Check match.
        $records = $this->_recordsTable->fetchObjects($select);
        $this->assertCount(0, $records);

    }


}
