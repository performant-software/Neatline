<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `pullStyles` on `NeatlineExhibit`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_PullStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * `pullStyles` should update the stylesheet with record values.
     */
    public function testPullStyles()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag1 {
              vector-color: 1;
              vector-opacity: 2;
            }
            .tag2 {
              stroke-color: 3;
              stroke-opacity: 4;
            }
            .tag3 {
              stroke-color: 5;
              stroke-opacity: 6;
            }
        ";

        $record = new NeatlineRecord($exhibit);
        $record->vector_color = '7';
        $record->vector_opacity = 8;
        $record->stroke_color = '9';
        $record->stroke_opacity = 10;
        $record->tags = 'tag1,tag2';

        // Pull styles.
        $exhibit->pullStyles($record);

        $this->assertEquals(_nl_readCSS($exhibit->styles), array(

            // `tag1` and `tag2` styles updated.
            'tag1' => array(
                'vector_color' => '7',
                'vector_opacity' => '8'
            ),
            'tag2' => array(
                'stroke_color' => '9',
                'stroke_opacity' => '10'
            ),

            // `tag3` styles unchanged.
            'tag3' => array(
                'stroke_color' => '5',
                'stroke_opacity' => '6'
            )

        ));

    }


    /**
     * When an invalid property is defined on the stylesheet, `pullStyles`
     * should ignore the rule.
     */
    public function testIgnoreInvalidProperties()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles = "
            .tag {
              vector-color: 1;
              invalid: value;
            }
        ";

        $record = new NeatlineRecord($exhibit);
        $record->vector_color = '2';
        $record->tags = 'tag';

        // Pull styles.
        $exhibit->pullStyles($record);

        // Invalid property should be ignored.
        $this->assertEquals(_nl_readCSS($exhibit->styles), array(
            'tag' => array(
                'vector_color' => '2',
                'invalid' => 'value'
            )
        ));

    }


}
