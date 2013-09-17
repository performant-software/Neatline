<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminImport extends Neatline_Case_Default
{


    /**
     * Insert item type and collection, set POST data.
     */
    public function setUp()
    {

        parent::setUp();

        // Exhibit:
        $this->exhibit = $this->_exhibit();

        // Item type:
        $this->type = insert_item_type(array('name' => 'Type'));

        // Collection:
        $this->collection = insert_collection(array(), array(
            'Dublin Core' => array ('Title' => array(
                array('text' => 'Collection', 'html' => false)
            ))
        ));

        // Query:
        $this->query = array(
            'range'         => '1-10',
            'collection'    => $this->collection->id,
            'type'          => $this->type->id,
            'tags'          => 'tag1,tag2'
        );

        // Set POST data.
        $this->request->setMethod('POST')->setPost($this->query);

    }


    /**
     * Query values should be saved and re-populated.
     */
    public function testSaveQuery()
    {

        // Import items.
        $this->dispatch('neatline/import/'.$this->exhibit->id);

        $this->resetResponse();
        $this->resetRequest();

        // Reload the form.
        $this->dispatch('neatline/import/'.$this->exhibit->id);

        // Should populate keywords, range, and tags:
        $this->assertXpath('//input[@name="range"][@value="1-10"]');
        $this->assertXpath('//input[@name="tags"][@value="tag1,tag2"]');

        // Should populate collection:
        $this->assertXpathContentContains(
            '//select[@name="collection"]/option[@selected="selected"]',
            'Collection'
        );

        // Should populate type:
        $this->assertXpathContentContains(
            '//select[@name="type"]/option[@selected="selected"]',
            'Type'
        );

    }


    /**
     * When "Import Items" is clicked, the `Neatline_Job_ImportItems` job
     * should be dispatched with the item query parameters.
     */
    public function testStartImport()
    {

        $jobs = $this->_mockJobDispatcher();

        // Should dispatch `Neatline_Job_ImportItems`.
        $jobs->expects($this->once())->method('sendLongRunning')->with(
            'Neatline_Job_ImportItems', array(

                'web_dir'       => nl_getWebDir(),
                'exhibit_id'    => $this->exhibit->id,
                'query'         => $this->query

            )
        );

        // Import items.
        $this->dispatch('neatline/import/'.$this->exhibit->id);

    }


}
