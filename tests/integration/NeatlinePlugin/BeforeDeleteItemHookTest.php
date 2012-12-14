<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests `before_delete_item` hook callback in plugin manager class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlinePluginTest_BeforeDeleteItemHook
    extends Neatline_Test_AppTestCase
{


    /**
     * When an item is deleted, all Neatline records that are backed by
     * the record should also be deleted.
     *
     * @author Eric Rochester <erochest@virginia.edu>
     */
    public function testBeforeDeleteRecord()
    {

        // Create record.
        $item = $this->__item();
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // Delete parent item.
        $item->delete();

        // Check for deleted record.
        $r2 = $this->_recordsTable->find($record->id);
        $this->assertNull($r2);

    }


}
