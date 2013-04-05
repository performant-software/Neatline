<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `save` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_Save extends Neatline_TestCase
{


    /**
     * `save` should compile the record.
     */
    public function testCompileFields()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        $record = $this->__record(null, $item);
        $record->save();

        // Should compile record.
        $this->assertNotNull($record->title);
        $this->assertNotNull($record->body);

    }


}
