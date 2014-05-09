<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordSelectItem extends Neatline_Case_Fixture
{


    public function setUp()
    {

        parent::setUp();

        // Delete the default "Foobar" item.
        $this->db->getTable('Item')->find(1)->delete();

    }


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);

        // No parent item.
        $this->_writeRecordApiFixture($record1,
            'EditorRecordSelectItem.noItem.record.json'
        );

        $item = $this->_item('Item Title');
        $record2 = $this->_record($this->exhibit, $item);

        // Parent item.
        $this->_writeRecordApiFixture($record2,
            'EditorRecordSelectItem.item.record.json'
        );

    }


    public function testItems()
    {

        $item1 = $this->_item('title1 keyword');
        $item2 = $this->_item('title2 keyword');
        $item3 = $this->_item('title3 keyword');
        $item4 = $this->_item('title4');
        $item5 = $this->_item('title5');

        $item1->added = '2025-01-01';
        $item2->added = '2024-01-01';
        $item3->added = '2023-01-01';
        $item4->added = '2022-01-01';
        $item5->added = '2021-01-01';

        $item1->save();
        $item2->save();
        $item3->save();
        $item4->save();
        $item5->save();

        $this->request->setQuery(array(
            'output' => 'omeka-xml'
        ));

        // All items.
        $this->_writeFixtureFromRoute('items/browse',
            'EditorRecordSelectItem.all.items.xml'
        );

        $this->request->setQuery(array(
            'output' => 'omeka-xml',
            'search' => 'keyword'
        ));

        // Results matching `keyword`.
        $this->_writeFixtureFromRoute('items/browse',
            'EditorRecordSelectItem.search.items.xml'
        );

    }


}
