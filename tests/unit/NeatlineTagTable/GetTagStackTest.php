<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getTagStack()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_GetTagStack
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * Working with a comma-delimited list of tags, getTagStack() should
     * return an ordered array of tags, one for each tag in the list, and
     * push the exhibit-default tag onto the end of the array.
     * --------------------------------------------------------------------
     */
    public function testGetTagStackWithNoRecordDefault()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create record.
        $record = $this->__record($exhibit);

        // Create 3 tags.
        // --------------

        $tag1 = new NeatlineTag($exhibit);
        $tag1->tag = 't1';
        $tag1->save();

        $tag2 = new NeatlineTag($exhibit);
        $tag2->tag = 't2';
        $tag2->save();

        $tag3 = new NeatlineTag($exhibit);
        $tag3->tag = 't3';
        $tag3->save();

        // Build the stack, get the exhibit tag.
        $stack = $this->_tagsTable->getTagStack('t1,t2,t3', $record);
        $exhibitTag = $this->_tagsTable->getExhibitTag($exhibit);

        // Check length and order.
        $this->assertCount(4, $stack);
        $this->assertEquals($stack[0]->id, $tag1->id);
        $this->assertEquals($stack[1]->id, $tag2->id);
        $this->assertEquals($stack[2]->id, $tag3->id);
        $this->assertEquals($stack[3]->id, $exhibitTag->id);

    }


}
