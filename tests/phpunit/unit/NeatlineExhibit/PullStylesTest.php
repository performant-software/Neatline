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

        $record = new NeatlineRecord($exhibit);
        $record->vector_color = '5';
        $record->vector_opacity = 6;
        $record->stroke_color = '7';
        $record->stroke_opacity = 8;
        $record->tags = 'tag1,tag2';

        // CSS
        $exhibit->styles = <<<CSS
.tag1 {
  vector-color: 1;
  vector-opacity: 2;
}
.tag2 {
  stroke-color: 3;
  stroke-opacity: 4;
}
CSS;

        // Pull styles.
        $exhibit->pullStyles($record);

        // Stylesheet should be updated with record values.
        $this->assertEquals(_nl_readCSS($exhibit->styles), array(
            'tag1' => array(
                'vector_color' => '5',
                'vector_opacity' => '6'
            ),
            'tag2' => array(
                'stroke_color' => '7',
                'stroke_opacity' => '8'
            )
        ));

    }


}
