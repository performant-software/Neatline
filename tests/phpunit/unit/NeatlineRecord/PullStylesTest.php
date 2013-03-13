<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `pullStyles` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_PullStyles
    extends Neatline_Test_AppTestCase
{


    /**
     * `pullStyles` should update record values to match exhibit CSS.
     */
    public function testPullStyles()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);

        $exhibit->styles = <<<CSS
.tag1 {
  vector-color: 1;
  vector-opacity: 2;
}
.tag2 {
  stroke-color: 3;
  stroke-opacity: 4;
}
.tag3 {
  select-color: 5;
  select-opacity: 6;
}
CSS;

        $exhibit->save();
        $record->pullStyles(array('tag1', 'tag2'));

        // Should pull `tag1` and `tag2` values.
        $this->assertEquals($record->vector_color, '1');
        $this->assertEquals($record->vector_opacity, 2);
        $this->assertEquals($record->stroke_color, '3');
        $this->assertEquals($record->stroke_opacity, 4);

        // Should not pull `tag3` values.
        $this->assertObjectNotHasAttribute('select_color', $record);
        $this->assertObjectNotHasAttribute('select_opacity', $record);

    }


}
