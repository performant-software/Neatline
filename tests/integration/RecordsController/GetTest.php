<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for INDX action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * GET should emit a JSON object containing a list of records with all
     * data needed by the front-end application.
     */
    public function testGet()
    {

        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $record1  = $this->__record($exhibit1);
        $record2  = $this->__record($exhibit1);
        $record3  = $this->__record($exhibit2);

        // Hit /records, should return 200.
        $this->dispatch('neatline/records/'.$exhibit1->id);
        $this->assertResponseCode(200);

        // Capture response, alias records.
        $response = $this->getResponseArray();
        $records  = $response->records;

        // Should be 2 records in the set.
        $this->assertEquals(count($records), 2);
        $this->assertEquals($response->count, 2);

        // Should emit records in the requested exhibit.
        $this->assertEquals($records[0]->id, $record1->id);
        $this->assertEquals($records[1]->id, $record2->id);

        // Should emit fields.
        $this->assertObjectHasAttribute('id',       $records[0]);
        $this->assertObjectHasAttribute('item_id',  $records[0]);
        $this->assertObjectHasAttribute('title',    $records[0]);
        $this->assertObjectHasAttribute('body',     $records[0]);
        $this->assertObjectHasAttribute('coverage', $records[0]);
        $this->assertObjectHasAttribute('tags',     $records[0]);
        $this->assertObjectHasAttribute('slug',     $records[0]);

        // Should emit styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $records[0]);
        }

    }


}
