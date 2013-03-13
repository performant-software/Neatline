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
              select-color: 5;
              select-opacity: 6;
            }
        ";

        $exhibit->save();

        // Pull `tag1` and `tag2`, save.
        $record->pullStyles(array('tag1', 'tag2'));
        $record->save();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Should pull `tag1` and `tag2`.
        $this->assertEquals($record->vector_color, '1');
        $this->assertEquals($record->vector_opacity, 2);
        $this->assertEquals($record->stroke_color, '3');
        $this->assertEquals($record->stroke_opacity, 4);

        // Should not pull `tag3`.
        $this->assertObjectNotHasAttribute('select_color', $record);
        $this->assertObjectNotHasAttribute('select_opacity', $record);

    }


    /**
     * When an invalid property is defined on the stylesheet, `pullStyles`
     * should ignore the rule.
     */
    public function testIgnoreInvalidProperties()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);
        $exhibit->styles = "
            .tag {
              vector-color: color;
              invalid: value;
            }
        ";

        $exhibit->save();

        // Pull `tag1`, save.
        $record->pullStyles(array('tag'));
        $record->save();

        // Reload record.
        $record = $this->_recordsTable->find($record->id);

        // Invalid property should be ignored.
        $this->assertEquals($record->vector_color, 'color');

    }


}
