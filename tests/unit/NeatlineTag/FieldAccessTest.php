<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineTag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * Test field set/get.
     * --------------------------------------------------------------------
     */
    public function testFieldAccess()
    {

        // Create a tag.
        $exhibit = $this->__exhibit();
        $tag = new NeatlineTag($exhibit);
        $tag->tag = 'tag';

        // Activate all styles.
        foreach (neatline_getStyleCols() as $s) $tag->$s= 1;
        $tag->save();

        // Re-get the record.
        $tag = $this->_tagsTable->find($tag->id);

        // Check values:
        foreach (neatline_getStyleCols() as $s) {
            $this->assertEquals($tag->$s, 1);
        }

    }


}
