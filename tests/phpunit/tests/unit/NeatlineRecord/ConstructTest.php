<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
        $this->assertEquals($exhibit->id, $record->exhibit_id);
        $this->assertEquals($item->id, $record->item_id);

    }


    /**
     * The `item_id` reference should be null when no item is passed.
     */
    public function testNoItem()
    {

        $exhibit    = $this->_exhibit();
        $record     = new NeatlineRecord($exhibit);

        // Exhibit key should be set.
        $this->assertEquals($exhibit->id, $record->exhibit_id);
        $this->assertNull($record->item_id);

    }


}
