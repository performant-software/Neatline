<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Regression tests for `syncStyles` on `NeatlineRecordTable`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_SyncStylesRegression
    extends Neatline_Test_AppTestCase
{


    /**
     * When `syncStyles` is called for a record in an exhibit that has a
     * "hanging" or "empty" tag definition - a tag is listed, but no style
     * definitions are defined for it - the empty tag should be ingored.
     */
    public function testIgnoreTagsWithoutStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag1';
        $record2->tags = 'tag1';
        $record1->save();
        $record2->save();

        // Empty `tag1`.
        $exhibit->styles = "
        tag1:
         - vector_color
        tag2:
        ";

        $exhibit->save();
        $record1->vector_color = 'color';

        // Sync styles.
        $this->_recordsTable->syncStyles($record1);
        $record2 = $this->_recordsTable->find($record2->id);

        // `tag1` should be applied, `tag2` ignored.
        $this->assertEquals($record2->vector_color, 'color');

    }


}
