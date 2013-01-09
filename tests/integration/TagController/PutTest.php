<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for PUT action in tag API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagControllerTest_Put
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * PUT should update a tag.
     * --------------------------------------------------------------------
     */
    public function testPut()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag1');

        // Mock PUT.
        $put = array('tag' => 'tag2');
        foreach (neatline_getStyleCols() as $s) $put[$s] = 1;

        // Issue request.
        $this->writePut($put);
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/tag/'.$tag->id);

        // Reload the tag.
        $tag = $this->_tagsTable->find($tag->id);

        // Check updated fields:
        $this->assertEquals($tag->tag, 'tag2');
        foreach (neatline_getStyleCols() as $s) {
            $this->assertEquals($tag->$s, 1);
        }

    }


}
