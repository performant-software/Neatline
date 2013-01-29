<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for NeatlinePlugin::addStyle.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_AfterSaveItem
    extends Neatline_Test_AppTestCase
{


    /**
     * hookAfterSaveItem() should update records that reference the item.
     * @group compile
     */
    public function testAfterSaveItem()
    {

        $item = insert_item();
        $record = new NeatlineRecord(null, $item);
        $record->title = '[item:"Title"]';
        $record->save();

        // Update the item.
        update_item($item, array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        // `_title` should be updated.
        $record = get_record_by_id('NeatlineRecord', $record->id);
        $this->assertEquals($record->_title, 'title');

    }


}
