<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `__construct()` on NeatlineTag.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineTagTest_Construct
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * __construct() should set foreign keys.
     * --------------------------------------------------------------------
     */
    public function testFieldDefaults()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $tag = new NeatlineTag($exhibit);

        // Exhibit key should be set.
        $this->assertEquals($tag->exhibit_id, $exhibit->id);

    }


}
