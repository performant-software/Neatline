<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ImportItemsTest extends Neatline_Case_Default
{


    /**
     * `Neatline_Job_ImportItems` should create Neatline records for all items
     * that match the search query.
     */
    public function testCreateRecords()
    {

        $item1 = $this->_item();
        $item2 = $this->_item();

        $exhibit = $this->_exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_Job_ImportItems', array(

                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item1->id)

            )
        );

        // Should match item 1, not item 2.
        $records = $this->_getRecordsByExhibit($exhibit);
        $this->assertEquals($item1->id, $records[0]['item_id']);
        $this->assertCount(1, $records);

    }


    /**
     * For any given Omeka item, `Neatline_Job_ImportItems` should check to
     * see if a record already exists in the exhibit for the item; if so, the
     * record should be re-compiled, but not duplicated.
     */
    public function testRecompileRecords()
    {

        $item = $this->_item();

        $exhibit = $this->_exhibit();

        // Create existing item-backed record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_Job_ImportItems', array(

                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Should not duplicate the record.
        $records = $this->_getRecordsByExhibit($exhibit);
        $this->assertCount(1, $records);

        // Should recompile the record.
        $this->assertNotNull($records[0]['item_title']);

    }


    /**
     * When a record is created for an item, the `added` field on the record
     * should match the `added` field on the parent item. This ensures that
     * the records will be listed in the Neatline editor in the same order as
     * the parent items in the Omeka admin.
     */
    public function testSetRecordAdded()
    {

        $item = $this->_item();
        $item->added = '2000-01-01 00:00:00';
        $item->save();

        $exhibit = $this->_exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_Job_ImportItems', array(

                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Should set `added` to match item.
        $record = $this->_getRecordsByExhibit($exhibit, true);
        $this->assertEquals('2000-01-01 00:00:00', $record->added);

    }


}
