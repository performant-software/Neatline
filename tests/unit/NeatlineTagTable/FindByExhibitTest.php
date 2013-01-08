<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getTagByName()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_FindByExhibit
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * findByExhibit() should retrieve all tags in an exhibit.
     * --------------------------------------------------------------------
     */
    public function testFindByExhibit()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit();
        $exhibit2 = $this->__exhibit();

        // Create tags.
        $tag1 = $this->__tag($exhibit1, 'tag1');
        $tag2 = $this->__tag($exhibit1, 'tag2');
        $tag3 = $this->__tag($exhibit2, 'tag3');

        // Get tags by exhibit.
        $tags = $this->_tagsTable->findByExhibit($exhibit1);
        $this->assertEquals($tags[0]->id, $tag1->id);
        $this->assertEquals($tags[1]->id, $tag2->id);
        $this->assertCount(2, $tags);

    }


}
