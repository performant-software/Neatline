<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_GetLayersForSelect extends Neatline_TestCase
{


    /**
     * `nl_getLayersForSelect` should convert the layers JSON to an array
     * of `id` => `name` pairs.
     */
    public function testGetLayersForSelect()
    {
        $this->assertEquals(nl_getLayersForSelect(), array(
            'Group1' => array(
                'Layer1' => 'Layer 1',
                'Layer2' => 'Layer 2'
            ),
            'Group2' => array(
                'Layer3' => 'Layer 3',
                'Layer4' => 'Layer 4'
            ),
            'Group3' => array(
                'Layer5' => 'Layer 5',
                'Layer6' => 'Layer 6'
            )
        ));
    }


}
