<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for GET action in tag API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * GET should emit a JSON object containing data for a single tag.
     * --------------------------------------------------------------------
     */
    public function testGet()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag');

        // Hit /tag/:id, capture response.
        $this->dispatch('neatline/tag/'.$tag->id);
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code.
        $this->assertResponseCode(200);

        // Check attributes.
        $this->assertObjectHasAttribute('id',  $response);
        $this->assertObjectHasAttribute('tag', $response);

        // Check styles.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertObjectHasAttribute($s, $response);
        }

    }


}
