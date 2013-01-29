<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `beforeSave()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_BeforeSave
    extends Neatline_Test_AppTestCase
{


    /**
     * beforeSave() should compile `_title` and `_body`.
     */
    public function testParentReferences()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        $record = $this->__record();
        $record->title = "[item:$item->id:\"Title\"]";
        $record->body = "[item:$item->id:\"Title\"]";
        $record->save();

        // `title` and `body` should be compiled.
        $this->assertEquals($record->_title, 'title');
        $this->assertEquals($record->_body, 'title');

    }


}
