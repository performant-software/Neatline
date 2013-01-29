<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `compile()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Compile
    extends Neatline_Test_AppTestCase
{


    /**
     * Set the view script path.
     */
    public function setUp()
    {
        parent::setUp();
        get_view()->setScriptPath(VIEW_SCRIPTS_DIR);
    }


    /**
     * [item].
     * @group compile
     */
    public function testItem()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        $texts = all_element_texts($item);
        $src = "
            [item]
            abc
            [item]
            def
            [item]
        ";
        $tar = "
            $texts
            abc
            $texts
            def
            $texts
        ";

        $record = new NeatlineRecord(null, $item);
        $record->title = $src;
        $record->body  = $src;
        $record->compile();

        // `_title` and `_body` should be compiled.
        $this->assertEquals($record->_title, $tar);
        $this->assertEquals($record->_body,  $tar);

    }


    /**
     * [item:"<element>"].
     * @group compile
     */
    public function testItemField()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                ),
                'Description' => array(
                    array('text' => 'description', 'html' => false)
                ),
                'Subject' => array(
                    array('text' => 'subject', 'html' => false)
                )
            )
        ));

        $src = "
            [item:\"Title\"]
            abc
            [item:\"Description\"]
            def
            [item:\"Subject\"]
        ";
        $tar = "
            title
            abc
            description
            def
            subject
        ";

        $record = new NeatlineRecord(null, $item);
        $record->title = $src;
        $record->body  = $src;
        $record->compile();

        // `_title` and `_body` should be compiled.
        $this->assertEquals($record->_title, $tar);
        $this->assertEquals($record->_body,  $tar);

    }


    /**
     * [item:files].
     * @group compile
     */
    public function testItemFiles()
    {

        $item = insert_item();
        insert_files_for_item($item, 'Filesystem', array(
            NL_DIR . '/tests/mocks/file1.txt'
        ));

        $files = files_for_item(array(), array(), $item);
        $src = "
            [item:files]
            abc
            [item:files]
            def
            [item:files]
        ";
        $tar = "
            $files
            abc
            $files
            def
            $files
        ";

        $record = new NeatlineRecord(null, $item);
        $record->title = $src;
        $record->body  = $src;
        $record->compile();

        // `_title` and `_body` should be compiled.
        $this->assertEquals($record->_title, $tar);
        $this->assertEquals($record->_body,  $tar);

    }


}
