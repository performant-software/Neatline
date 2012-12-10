<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getExhibitDefault()` on NeatlineTagTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTableTest_GetExhibitDefault
    extends Neatline_Test_AppTestCase
{


    /**
     * getExhibitDefault() should return the default tag record for an
     * exhibit.
     *
     * @group tags
     */
    public function testGetExhibitDefault()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();
        $exhibit->slug = 'test';
        $exhibit->save();

        // Get default tag.
        $tag = $this->_tagsTable->getExhibitDefault($exhibit);
        $this->assertEquals($tag->exhibit_id, $exhibit->id);

    }


}
