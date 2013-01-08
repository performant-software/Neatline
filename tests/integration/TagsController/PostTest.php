<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for POST action in tags API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagsControllerTest_Post
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * POST should create a new tag and redirect to tags/:id, which should
     * respond with a JSON object with a non-null id and coverage.
     * --------------------------------------------------------------------
     */
    public function testPost()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Hit /tags with POST.
        $c1 = $this->_tagsTable->count();
        $this->request->setMethod('POST');
        $this->dispatch('neatline/tags/'.$exhibit->id);
        $c2 = $this->_tagsTable->count();

        // Capture response, check code.
        $response = json_decode($this->getResponse()->getBody('default'));
        $this->assertResponseCode(200);

        // Check for new id.
        $this->assertNotNull($response->id);
        $this->assertEquals($c2, $c1+1);

    }


}
