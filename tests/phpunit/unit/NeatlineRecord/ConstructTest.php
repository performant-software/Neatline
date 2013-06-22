<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_Construct extends Neatline_Case_Default
{


    /**
     * `__construct` should set foreign keys.
     */
    public function testSetParentReferences()
    {

        $exhibit    = $this->_exhibit();
        $item       = $this->_item();
        $record     = new NeatlineRecord($exhibit, $item);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $exhibit->id);
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * The `item_id` reference should be null when no item is passed.
     */
    public function testNoItem()
    {

        $exhibit    = $this->_exhibit();
        $record     = new NeatlineRecord($exhibit);

        // Exhibit key should be set.
        $this->assertEquals($record->exhibit_id, $exhibit->id);
        $this->assertNull($record->item_id);

    }


}
