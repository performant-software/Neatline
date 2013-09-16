<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_Explode extends Neatline_Case_Default
{


    /**
     * `nl_explode` should trim a string, scrub spaces, and split on ','.
     */
    public function testExplode()
    {
        $this->assertEquals(array('1', '2', '3'), nl_explode('1,2,3'));
        $this->assertEquals(array('1','2','3'), nl_explode(' 1,2,3 '));
        $this->assertEquals(array('1','2','3'), nl_explode(' 1, 2, 3 '));
    }


}
