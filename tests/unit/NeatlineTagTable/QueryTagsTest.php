<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryTags()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_QueryTags
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * queryTags() should construct an array representation of the tags in
     * an exhibit to be returned by the tags REST API.
     * --------------------------------------------------------------------
     */
    public function testQueryTags()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create tags.
        $tag1 = $this->__tag($exhibit1, 'tag1', true);
        $tag2 = $this->__tag($exhibit1, 'tag2', false);
        $tag3 = $this->__tag($exhibit2, 'tag3');

        // Query tags.
        $tags = $this->_tagsTable->queryTags($exhibit1);

        // Check identities
        $this->assertEquals($tags[0]['tag'], 'tag1');
        $this->assertEquals($tags[1]['tag'], 'tag2');
        $this->assertCount(2, $tags);

        // Check active styles on tag1.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertTrue($tags[0][$s]);
        }

        // Check inactive styles on tag1.
        foreach (neatline_getStyleCols() as $s) {
            $this->assertFalse($tags[1][$s]);
        }

    }


}
