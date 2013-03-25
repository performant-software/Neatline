<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `ItemImporter`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ItemImporterTest_Explode extends Neatline_TestCase
{


    /**
     * `ItemImporter` should apply the search query.
     */
    public function testCreateRecords()
    {

        $item1 = $this->__item();
        $item2 = $this->__item();
        $exhibit = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('ItemImporter', array(
                'query' => array('range' => $item1->id),
                'exhibit_id' => $exhibit->id
            )
        );

        // Should match item 1.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['records'][0]['item_id'],$item1->id);
        $this->assertEquals($records['count'], 1);

    }


    /**
     * For any given Omeka item, `ItemImporter` should check to see if a
     * Neatline record already exists in the exhibit for the item; if so,
     * the record should be re-saved/compiled, but not duplicated.
     */
    public function testBlockDuplicates()
    {

        $item = $this->__item();
        $exhibit = $this->__exhibit();

        // Create existing item-backed record.
        $record = new NeatlineRecord($exhibit, $item);
        $record->__save();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('ItemImporter', array(
                'query' => array('range' => $item->id),
                'exhibit_id' => $exhibit->id
            )
        );

        // Should not duplicate item 1 record.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['count'], 1);

        // Should (re)compile the existing record.
        $this->assertNotNull($records['records'][0]['body']);

    }


}
