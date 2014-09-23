<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_Explode extends Neatline_Case_Default
{


    /**
     * Split on ','.
     */
    public function testSplitOnComma()
    {
        $this->assertEquals(array('1','2','3'), nl_explode('1,2,3'));
    }


    /**
     * Trim whitespace.
     */
    public function testTrimWhitespace()
    {
        $this->assertEquals(array('1','2','3'), nl_explode(' 1,2,3 '));
    }


    /**
     * Remove spaces.
     */
    public function testRemoveSpaces()
    {
        $this->assertEquals(array('1','2','3'), nl_explode('1, 2, 3'));
    }


}
