<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_Explode extends Neatline_Case_Default
{


    /**
     * `nl_explode` should split on ','.
     */
    public function testSplitOnComma()
    {
        $this->assertEquals(array('1','2','3'), nl_explode('1,2,3'));
    }


    /**
     * `nl_explode` should trim whitespace.
     */
    public function testTrimWhitespace()
    {
        $this->assertEquals(array('1','2','3'), nl_explode(' 1,2,3 '));
    }


    /**
     * `nl_explode` should remove spaces.
     */
    public function testRemoveSpaces()
    {
        $this->assertEquals(array('1','2','3'), nl_explode('1, 2, 3'));
    }


}
