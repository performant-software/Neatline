<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_WriteCss extends Neatline_Case_Default
{


    /**
     * `nl_writeCSS` should convert an array into a CSS string.
     */
    public function testwriteCSS()
    {

        $css = <<<CSS
.tag1 {
  prop-1: val1;
  prop-2: val2;
}

.tag2 {
  prop-3: val3;
  prop-4: val4;
}
CSS;

        $this->assertEquals($css, nl_writeCSS(array(
            'tag1' => array(
                'prop_1' => 'val1',
                'prop_2' => 'val2'
            ),
            'tag2' => array(
                'prop_3' => 'val3',
                'prop_4' => 'val4'
            )
        )));

    }


    /**
     * `$breaks` should set the number of blank lines between rule sets.
     */
    public function testBreaks()
    {

        $css = <<<CSS
.tag1 {
  prop-1: val1;
}


.tag2 {
  prop-2: val2;
}
CSS;

        $this->assertEquals($css, nl_writeCSS(array(
            'tag1' => array(
                'prop_1' => 'val1'
            ),
            'tag2' => array(
                'prop_2' => 'val2',
            )
        ), 2));

    }


    /**
     * `$indent` should set the rule indentation width.
     */
    public function testIndent()
    {

        $css = <<<CSS
.tag {
    prop: val;
}
CSS;

        $this->assertEquals($css, nl_writeCSS(array(
            'tag' => array('prop' => 'val')
        ), null, 4));

    }


}
