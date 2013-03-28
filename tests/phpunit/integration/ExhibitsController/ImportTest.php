<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for IMPORT action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Import extends Neatline_TestCase
{


    /**
     * Query values should be saved and re-populated.
     */
    public function testSaveQuery()
    {

        $exhibit = $this->__exhibit();

        // Create mock collection.
        $collection = insert_collection(array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'Collection', 'html' => false)
                )
            )
        ));

        // Create mock type.
        $type = insert_item_type(array('name' => 'Type'));

        // Set POST data.
        $this->request->setMethod('POST')->setPost(array(
            'search'        => 'Keywords',
            'range'         => '1-10',
            'collection'    => $collection->id,
            'type'          => $type->id,
            'tags'          => 'tag1,tag2'
        ));

        $this->dispatch('neatline/import/'.$exhibit->id);

        // Inputs:
        $this->assertXpath('//input[@name="search"][@value="Keywords"]');
        $this->assertXpath('//input[@name="range"][@value="1-10"]');
        $this->assertXpath('//input[@name="tags"][@value="tag1,tag2"]');

        // Selects:
        $this->assertXpath(
            '//select[@name="collection"]/option[@selected="selected"]
            [@label="Collection"]');
        $this->assertXpath(
            '//select[@name="type"]/option[@selected="selected"]
            [@label="Type"]');

    }


}
