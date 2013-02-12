<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `_nl_explode`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_Explode
    extends Neatline_Test_AppTestCase
{


    /**
     * `_nl_explode` should trim a string, scrub spaces, and split on ','.
     */
    public function testExplode()
    {
        $this->assertEquals(_nl_explode('1,2,3'),
            array('1', '2', '3'));
        $this->assertEquals(_nl_explode(' 1,2,3 '),
            array('1','2','3'));
        $this->assertEquals(_nl_explode(' 1, 2, 3 '),
            array('1','2','3'));
    }


}
