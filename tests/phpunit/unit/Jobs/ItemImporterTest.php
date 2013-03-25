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
     * `ItemImporter` should match keyword queries.
     */
    public function testMatchKeywords()
    {

        $item1 = $this->__item('David McClure');
        $item2 = $this->__item('David William McClure');
        $item3 = $this->__item('Kara Weisman');
        $exhibit = $this->__exhibit();

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('ItemImporter', array(
                'query' => array('search' => 'David'),
                'exhibit_id' => $exhibit->id
            )
        );

        // Should match items 1 and 2.
        $records = $this->__records->queryRecords($exhibit);
        $this->assertEquals($records['records'][0]['item_id'],$item1->id);
        $this->assertEquals($records['records'][1]['item_id'],$item2->id);
        $this->assertEquals($records['count'], 2);

    }


    /**
     * `ItemImporter` should match range queries.
     */
    public function testMatchRange()
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
     * `ItemImporter` should match collection queries.
     */
    public function testMatchCollection()
    {
        // TODO
    }


    /**
     * `ItemImporter` should match type queries.
     */
    public function testMatchType()
    {
        // TODO
    }


    /**
     * `ItemImporter` should match tags queries.
     */
    public function testMatchTags()
    {
        // TODO
    }


    /**
     * For any given Omeka item, `ItemImporter` should check to see if a
     * Neatline record already exists in the exhibit for the item; if so,
     * the record should be re-saved/compiled, but not duplicated.
     */
    public function testBlockDuplicates()
    {
        // TODO
    }


}
