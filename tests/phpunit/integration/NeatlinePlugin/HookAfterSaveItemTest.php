<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
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
        $record = $this->__record(null, $item);

        // Update the item.
        update_item($item, array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        // Record should be compiled.
        $record = $this->reload($record);
        $this->assertNotNull($record->title);
        $this->assertNotNull($record->body);

    }


}
