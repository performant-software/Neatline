<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `compile` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_Compile extends Neatline_TestCase
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
     * `[item]` should be replaced with the full item metadata output.
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
     * `[item:"<element>"]` should be replaced with element text values.
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
     * `[item:files]` should be replaced with file display markup.
     * @group compile
     */
    public function testItemFiles()
    {

        $item = insert_item();
        insert_files_for_item($item, 'Filesystem', array(
            NL_DIR . '/tests/phpunit/mocks/file.txt'
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


    /**
     * When no `item_id` is set on the record, the raw fields should be
     * copied unchanged into the compiled fields.
     * @group compile
     */
    public function testWithNoItemId()
    {

        $record = $this->__record();
        $record->title  = 'title';
        $record->body   = 'body';
        $record->compile();

        $this->assertEquals($record->_title, 'title');
        $this->assertEquals($record->_body, 'body');

    }


}
