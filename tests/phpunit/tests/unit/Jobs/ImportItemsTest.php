<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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

                'web_dir'       => nl_getWebDir(),
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

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Should not duplicate the record.
        $records = $this->_getRecordsByExhibit($exhibit);
        $this->assertCount(1, $records);

        // Should recompile the record.
        $this->assertNotNull($records[0]['body']);

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

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Should set `added` to match item.
        $record = $this->_getRecordsByExhibit($exhibit, true);
        $this->assertEquals('2000-01-01 00:00:00', $record->added);

    }


    /**
     * The import job should manually update the `webDir` property on the
     * filesystem adapter. This ensures that file links will point to the web-
     * accessible URLs of the files, not the local filesystem.
     */
    public function testSetWebDirectory()
    {

        $item = $this->_item();

        $exhibit = $this->_exhibit();

        insert_files_for_item($item, 'Filesystem', array(
            NL_TEST_DIR.'/mocks/file.txt'
        ));

        Zend_Registry::get('bootstrap')->getResource('jobs')->
            send('Neatline_Job_ImportItems', array(

                'web_dir'       => 'webDir',
                'exhibit_id'    => $exhibit->id,
                'query'         => array('range' => $item->id)

            )
        );

        // Load the new record.
        $record = $this->_getRecordsByExhibit($exhibit, true);

        // Parse `body` HTML.
        $doc = new DOMDocument();
        $doc->loadHTML($record->body);

        // Query for the file link.
        $xpath = new DOMXpath($doc);
        $anchor = $xpath->query('//a[@class="download-file"]')->item(0);

        // Link should start with 'webDir/'
        $this->assertEquals(
            'webDir/',
            substr($anchor->getAttribute('href'), 0, 7)
        );

    }


}
