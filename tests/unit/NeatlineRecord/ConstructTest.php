<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `__construct()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Construct
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * __construct() should set foreign keys.
     * --------------------------------------------------------------------
     */
    public function testParentReferences()
    {

        // Create exhibit and item.
        $exhibit = $this->__exhibit();
        $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);

        // Item and exhibit references should be set.
        $this->assertEquals($record->exhibit_id, $exhibit->id);
        $this->assertEquals($record->item_id, $item->id);

    }


    /**
     * --------------------------------------------------------------------
     * A record should not be associated with an item when an item is not
     * passed to the constructor.
     * --------------------------------------------------------------------
     */
    public function testParentReferencesWithNoParentItem()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);

        // Exhibit key should be set.
        $this->assertEquals($record->exhibit_id, $exhibit->id);
        $this->assertNull($record->item_id);

    }


}
