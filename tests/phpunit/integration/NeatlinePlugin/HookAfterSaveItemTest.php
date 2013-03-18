<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `hookAfterSaveItem` on `NeatlinePlugin`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlinePluginTest_HookAfterSaveItem extends Neatline_TestCase
{


    /**
     * `hookAfterSaveItem` should update records that reference the item.
     */
    public function testHookAfterSaveItem()
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
