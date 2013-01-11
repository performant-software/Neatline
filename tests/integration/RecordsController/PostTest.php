<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for POST action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsControllerTest_Post
    extends Neatline_Test_AppTestCase
{


    /**
     * POST should create a new record and redirect to records/:id, which
     * should respond with a JSON object with a non-null id and coverage.
     */
    public function testPost()
    {

        $exhibit = $this->__exhibit();

        // Hit /records with POST.
        $c1 = $this->_recordsTable->count();
        $this->request->setMethod('POST');
        $this->dispatch('neatline/records/'.$exhibit->id);
        $c2 = $this->_recordsTable->count();

        // Capture response, check code.
        $response = $this->getResponseArray();
        $this->assertResponseCode(200);

        // Should emit id and coverage.
        $this->assertNotNull($response->id);
        $this->assertNotNull($response->coverage);
        $this->assertEquals($c2, $c1+1);

    }


}
