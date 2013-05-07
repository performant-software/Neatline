<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ImportItemsTest extends Neatline_TestCase
{


    /**
     * `Neatline_ImportItems` should apply the search query.
     */
    public function testCreateRecords()
    {

        $item1      = $this->__item();
        $item2      = $this->__item();
        $exhibit    = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(
                'query' => array('range' => $item1->id),
                'exhibit_id' => $exhibit->id
            )
        );

        // Should match item 1, not item 2.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['records'][0]['item_id'],$item1->id);
        $this->assertEquals($records['count'], 1);

    }


    /**
     * For any given Omeka item, `Neatline_ImportItems` should check to
     * see if a record already exists in the exhibit for the item; if so,
     * the record should be re-compiled, but not duplicated.
     */
    public function testRecompileRecords()
    {

        $item       = $this->__item();
        $exhibit    = $this->__exhibit();

        // Create existing item-backed record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(
                'query' => array('range' => $item->id),
                'exhibit_id' => $exhibit->id
            )
        );

        // Should not duplicate the record.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['count'], 1);

        // Should recompile the record.
        $this->assertNotNull($records['records'][0]['body']);

    }


    /**
     * When a new record is created for an item, the `added` field on the
     * record should be set to match the `added` field on the parent item.
     * This ensures that the records will be listed in the Neatline editor
     * in the same order as the parent items in the Omeka admin.
     */
    public function testSetRecordAdded()
    {

        $item = $this->__item();
        $item->added = '2000-01-01 00:00:00';
        $item->save();

        $exhibit = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_ImportItems', array(
                'query' => array('range' => $item->id),
                'exhibit_id' => $exhibit->id
            )
        );

        // Get the new record.
        $record = $this->__records->findBySql(
            'exhibit_id=?', array($exhibit->id), true
        );

        // Should set `added` to match item.
        $this->assertEquals($record->added, '2000-01-01 00:00:00');

    }


}
