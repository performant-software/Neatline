<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `neatline_explodeTags()` helper.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_HelpersTest_ExplodeTags
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * neatline_explodeTags() should remove all whitespace from the input
     * string and return an array of comma-delimited substrings.
     * --------------------------------------------------------------------
     */
    public function testExplodeTags()
    {

        // No space.
        $this->assertEquals(neatline_explodeTags('a,b,c'), array(
            'a', 'b', 'c'
        ));

        // Untrimmed.
        $this->assertEquals(neatline_explodeTags(' a,b,c '), array(
            'a', 'b', 'c'
        ));

        // Interior whitespace.
        $this->assertEquals(neatline_explodeTags('a, b, c'), array(
            'a', 'b', 'c'
        ));

    }


}
