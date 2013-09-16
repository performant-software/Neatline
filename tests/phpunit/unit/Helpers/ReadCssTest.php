<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_ReadCss extends Neatline_Case_Default
{


    /**
     * `nl_readCSS` should convert a CSS string into an array.
     */
    public function testReadCSS()
    {
        $this->assertEquals(array(
            'tag1' => array(
                'prop_1' => 'val1',
                'prop_2' => 'val2'
            ),
            'tag2' => array(
                'prop_3' => 'val3',
                'prop_4' => 'val4'
            )
        ), nl_readCSS("
            .tag1 {
                prop-1: val1;
                prop-2: val2;
            }
            .tag2 {
                prop-3: val3;
                prop-4: val4;
            }
        "));
    }


}
