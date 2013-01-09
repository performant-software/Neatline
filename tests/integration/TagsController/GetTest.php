<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for GET action in tags API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagsControllerTest_GET
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * GET should emit a JSON object containing a list of tags with all
     * data needed by the front-end application.
     * --------------------------------------------------------------------
     */
    public function testGet()
    {

        // Create exhibits and tags.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();
        $tag1 = $this->__tag($exhibit1, 'tag1');
        $tag2 = $this->__tag($exhibit1, 'tag2');
        $tag3 = $this->__tag($exhibit2, 'tag3');

        // Hit /records, capture response.
        $this->dispatch('neatline/tags/'.$exhibit1->id);
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code and length.
        $this->assertResponseCode(200);
        $this->assertCount(2, $response);

        // Check record identities.
        $this->assertEquals($response[0]->id, $tag1->id);
        $this->assertEquals($response[1]->id, $tag2->id);

        // Check attributes.
        $this->assertObjectHasAttribute('id',  $response[0]);
        $this->assertObjectHasAttribute('tag', $response[0]);

        // Check styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $response[0]);
        }

    }


}
