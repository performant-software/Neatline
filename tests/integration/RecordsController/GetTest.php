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

        // Hit /records, capture response.
        $this->dispatch('neatline/records/'.$exhibit1->id);
        $response = $this->getResponseArray();
        $this->assertEquals(count($response), 2);
        $this->assertResponseCode(200);

        // Should emit records in the requested exhibit.
        $this->assertEquals($response[0]->id, $record1->id);
        $this->assertEquals($response[1]->id, $record2->id);

        // Should emit fields.
        $this->assertObjectHasAttribute('id',       $response[0]);
        $this->assertObjectHasAttribute('item_id',  $response[0]);
        $this->assertObjectHasAttribute('title',    $response[0]);
        $this->assertObjectHasAttribute('body',     $response[0]);
        $this->assertObjectHasAttribute('slug',     $response[0]);
        $this->assertObjectHasAttribute('coverage', $response[0]);

        // Should emit styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $response[0]);
        }

    }


}
