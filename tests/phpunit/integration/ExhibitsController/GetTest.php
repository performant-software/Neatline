<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Get extends Neatline_TestCase
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
