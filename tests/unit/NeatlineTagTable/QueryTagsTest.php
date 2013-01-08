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
        $tag1 = $this->__tag($exhibit1, 'tag1');
        $tag2 = $this->__tag($exhibit1, 'tag2');
        $tag3 = $this->__tag($exhibit2, 'tag3');

        // Activate all styles.
        foreach (array($tag1, $tag2, $tag2) as $t) {
            foreach (array_keys(neatline_getStyles()) as $s) $t->$s= 1;
            $t->save();
        }

        // Query tags.
        $tags = $this->_tagsTable->queryTags($exhibit1);

        // Check identities
        $this->assertEquals($tags[0]['tag'], 'tag1');
        $this->assertEquals($tags[1]['tag'], 'tag2');
        $this->assertCount(2, $tags);

        // Check for styles.
        foreach ($tags as $t) {
            foreach (array_keys(neatline_getStyles()) as $s) {
                $this->assertEquals($t[$s], 1);
            }
        }

    }


}
