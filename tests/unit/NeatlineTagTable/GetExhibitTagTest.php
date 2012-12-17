<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getExhibitTag()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_GetExhibitTag
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * getExhibitTag() should return the default tag for an exhibit.
     * --------------------------------------------------------------------
     */
    public function testGetExhibitTag()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Get default tag.
        $tag = $this->_tagsTable->getExhibitTag($exhibit);
        $this->assertEquals($exhibit->tag_id, $tag->id);

    }


}
