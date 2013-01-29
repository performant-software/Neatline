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
     * [item:ID].
     * @group compile
     */
    public function testItemId()
    {

        $item1 = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title1', 'html' => false)
                )
            )
        ));

        $item2 = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title2', 'html' => false)
                )
            )
        ));

        $item3 = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title3', 'html' => false)
                )
            )
        ));

        // Generate texts output.
        get_view()->setScriptPath(VIEW_SCRIPTS_DIR);
        $texts1 = all_element_texts($item1);
        $texts2 = all_element_texts($item2);
        $texts3 = all_element_texts($item3);

        $raw = <<<EOD
[item:$item1->id]
abc
[item:$item2->id]
def
[item:$item3->id]
EOD;

        $compiled = <<<EOD
$texts1
abc
$texts2
def
$texts3
EOD;

        $record = $this->__record();
        $record->title = $raw;
        $record->body  = $raw;
        $record->compile();

        // `title` and `body` should be compiled.
        $this->assertEquals($record->_title, $compiled);
        $this->assertEquals($record->_body,  $compiled);

    }


    /**
     * [item:ID:"Field"].
     * @group compile
     */
    public function testItemIdField()
    {

        $item = insert_item(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                ),
                'Subject' => array(
                    array('text' => 'subject', 'html' => false)
                ),
                'Description' => array(
                    array('text' => 'description', 'html' => false)
                )
            )
        ));

        $raw = <<<EOD
[item:$item->id:"Title"]
abc
[item:$item->id:"Subject"]
def
[item:$item->id:"Description"]
EOD;

        $compiled = <<<EOD
title
abc
subject
def
description
EOD;

        $record = $this->__record();
        $record->title = $raw;
        $record->body  = $raw;
        $record->compile();

        // `title` and `body` should be compiled.
        $this->assertEquals($record->_title, $compiled);
        $this->assertEquals($record->_body,  $compiled);

    }


}
