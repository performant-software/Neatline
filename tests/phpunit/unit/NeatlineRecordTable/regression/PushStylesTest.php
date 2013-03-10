<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Regression tests for `pushStyles` on `NeatlineRecordTable`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_PushStylesRegression
    extends Neatline_Test_AppTestCase
{


    /**
     * When `pushStyles` is called for an exhibit that has a "hanging" or
     * "empty" tag definition - a tag is listed, but no style definitions
     * are defined for it - the empty tag should be ingored.
     */
    public function testIgnoreTagsWithoutStyles()
    {

        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        // Empty `tag2`.
        $exhibit->styles = "
        tag1:
         - vector_color: 'color'
        tag2:
        ";

        // Apply styles, reload records.
        $this->_recordsTable->pushStyles($exhibit);
        $record = $this->_recordsTable->find($record->id);

        // `tag1` should be applied, `tag2` ignored.
        $this->assertEquals($record->vector_color, 'color');

    }


}
