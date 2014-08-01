<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterExtent
    extends Neatline_Case_Default
{


    /**
     * `extent` ~ Match records that overlap with the passed bounding box.
     */
    public function testFilterExtent()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);

        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';
        $record1->added     = '2002-01-01';
        $record2->added     = '2001-01-01';

        $record1->save();
        $record2->save();

        // No extent should match all records.
        // --------------------------------------------------------------------
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);


        // Intersection with Record 1 should match Record 1.
        // --------------------------------------------------------------------
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'extent' => 'POINT(0 1)'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);


        // Intersection with Record 2 should match Record 2.
        // --------------------------------------------------------------------
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'extent' => 'POINT(0 2)'
        ));

        $this->assertEquals($record2->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);


        // Intersection with Record 1 and Record 2 should match both records.
        // --------------------------------------------------------------------
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'extent' => 'LINESTRING(0 1,0 2)'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertEquals($record2->id, $result['records'][1]['id']);
        $this->assertCount(2, $result['records']);

    }


    /**
     * When an `extent` polygon is passed to `queryRecords`, records that have
     * been saved with empty coverages (represented with the de-facto NULL
     * `POINT(0 0)` WKT string) should not be returned in the result set, even
     * when the `extent` includes the 0,0 point.
     */
    public function testFilterExtentNoCoverageOmission()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);

        $record1->coverage = 'POINT(1 1)';

        $record1->save();
        $record2->save();

        // Record with `POINT(0 0)` excluded.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'extent' => 'LINESTRING(0 0,1 1)'
        ));

        $this->assertEquals($record1->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


    /**
     * When a WMS layer is defined on a record, the record should always be
     * matched by extent queries.
     */
    public function testFilterExtentWmsLayerInclusion()
    {

        $exhibit = $this->_exhibit();
        $record = $this->_record($exhibit);

        $record->wms_address = 'address';
        $record->wms_layers = 'layers';

        $record->save();

        // WMS layer should be included.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'extent' => 'POINT(1 1)'
        ));

        $this->assertEquals($record->id, $result['records'][0]['id']);
        $this->assertCount(1, $result['records']);

    }


}
