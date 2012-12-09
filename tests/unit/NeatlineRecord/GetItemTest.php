<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `getItem()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_GetItem
    extends Neatline_Test_AppTestCase
{


    /**
     * getItem() should return the parent item when one exists.
     */
    public function testGetItemWithItem()
    {

        // Create a record.
        $neatline = $this->__exhibit();
        $item = $this->__item();
        $record = new NeatlineRecord($item, $neatline);

        // Get the item.
        $retrievedItem = $record->getItem();
        $this->assertEquals($item->id, $retrievedItem->id);

    }


    /**
     * getItem() should return null when there is not a parent item.
     */
    public function testGetItemWithNoItem()
    {

        // Create a record.
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord(null, $neatline);

        // Get the item.
        $retrievedItem = $record->getItem();
        $this->assertNull($retrievedItem);

    }


}
