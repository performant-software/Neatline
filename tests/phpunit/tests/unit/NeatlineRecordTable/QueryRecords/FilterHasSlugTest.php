<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecordsFilterHasSlug
    extends Neatline_Case_Default
{


    /**
     * `hasSlug` ~ Match records that have non-empty slugs.
     */
    public function testFilterHasSlug()
    {

        $exhibit = $this->_exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->slug = 'slug';
        $record2->slug = null;

        $record1->save();
        $record2->save();

        // Query for `hasSlug`.
        $result = $this->_records->queryRecords(array(
            'exhibit_id' => $exhibit->id,'hasSlug' => true
        ));

        $this->assertEquals($result['records'][0]['id'], $record1->id);
        $this->assertCount(1, $result['records']);

    }


}
