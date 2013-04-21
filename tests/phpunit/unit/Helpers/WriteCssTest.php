<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `nl_writeCSS`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_WriteCss extends Neatline_TestCase
{


    /**
     * `nl_writeCSS` should convert an array into a CSS string.
     */
    public function testwriteCSS()
    {
        $this->assertEquals(nl_writeCSS(array(
            'tag1' => array(
                'prop_1' => 'val1',
                'prop_2' => 'val2'
            ),
            'tag2' => array(
                'prop_3' => 'val3',
                'prop_4' => 'val4'
            )
        )), <<<CSS
.tag1 {
  prop-1: val1;
  prop-2: val2;
}

.tag2 {
  prop-3: val3;
  prop-4: val4;
}
CSS
        );
    }


    /**
     * `$breaks` should set the number of blank lines between rule sets.
     */
    public function testBreaks()
    {
        $this->assertEquals(nl_writeCSS(array(
            'tag1' => array(
                'prop_1' => 'val1'
            ),
            'tag2' => array(
                'prop_2' => 'val2',
            )
        ), 2), <<<CSS
.tag1 {
  prop-1: val1;
}


.tag2 {
  prop-2: val2;
}
CSS
        );
    }


    /**
     * `$indent` should set the rule indentation width.
     */
    public function testIndent()
    {
        $this->assertEquals(nl_writeCSS(array(
            'tag' => array('prop' => 'val')
        ), null, 4), <<<CSS
.tag {
    prop: val;
}
CSS
        );
    }


}
