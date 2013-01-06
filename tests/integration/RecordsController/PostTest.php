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
     * GET should create a new record and echo a JSON object with the id.
     * --------------------------------------------------------------------
     */
    public function testPost()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Issue request.
        $this->request->setMethod('POST');
        $this->dispatch('neatline/record');
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code.
        $this->assertResponseCode(200);

        // Check for non-null id.
        $this->assertNotNull($response->id);

    }


}
