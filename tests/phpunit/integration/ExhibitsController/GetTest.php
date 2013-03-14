<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for GET action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsControllerTest_Get
    extends Neatline_Test_AppTestCase
{


    /**
     * GET should emit a JSON representation of a exhibit.
     */
    public function testGet()
    {

        $exhibit = $this->__exhibit();

        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $response = $this->getResponseArray();

        // Should emit all attributes.
        foreach (array_keys($exhibit->toArray()) as $k) {
            $this->assertObjectHasAttribute($k, $response);
        }

    }


}
