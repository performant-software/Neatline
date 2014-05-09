<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsCountRecords
    extends Neatline_Case_Default
{


    /**
     * The result set should include a `numFound` key with the original size
     * of the result set before the limit was applied.
     */
    public function testCountRecords()
    {

        $exhibit = $this->_exhibit();
        $record1 = $this->_record($exhibit);
        $record2 = $this->_record($exhibit);
        $record3 = $this->_record($exhibit);

        // Limit to 2 records.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id, 'limit' => 2, 'offset' => 0
        ));

        $this->assertEquals(3, $result['numFound']);

    }


}
