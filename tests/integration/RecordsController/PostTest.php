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
     * --------------------------------------------------------------------
     * POST should create a new record and redirect to records/:id, which
     * should respond with a JSON object with a non-null id and coverage.
     * --------------------------------------------------------------------
     */
    public function testPost()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Hit /exhibits with POST.
        $c1 = $this->_recordsTable->count();
        $this->request->setMethod('POST');
        $this->dispatch('neatline/records/'.$exhibit->id);
        $c2 = $this->_recordsTable->count();

        // Capture response, check code.
        $response = json_decode($this->getResponse()->getBody('default'));
        $this->assertResponseCode(200);

        // Check for new id and coverage.
        $this->assertNotNull($response->id);
        $this->assertNotNull($response->coverage);
        $this->assertEquals($c2, $c1+1);

    }


}
