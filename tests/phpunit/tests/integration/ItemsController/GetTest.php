<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ItemsControllerTest_Get extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_mockTheme();
    }


    /**
     * When a record is specified that matches a tag-specific template in the
     * custom exhibit theme, GET should apply the tag template.
     */
    public function testRecordTagTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // Assign `tag1`.
        $record->tags = 'tag1';
        $record->save();

        // Load the item body.
        $this->request->setQuery(array('record' => $record->id));
        $this->dispatch('neatline/items/'.$item->id);

        // Should render the tag template.
        $body = trim($this->_getResponseBody());
        $this->assertEquals("custom-{$item->id}-tag1", $body);

    }


    /**
     * When a record is specified that matches a exhibit-generic template in
     * the custom exhibit theme, GET should apply the exhibit template.
     */
    public function testExhibitSlugTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // Load the item body.
        $this->request->setQuery(array('record' => $record->id));
        $this->dispatch('neatline/items/'.$item->id);

        // Should render the exhibit template.
        $body = trim($this->_getResponseBody());
        $this->assertEquals("custom-{$item->id}", $body);

    }


    /**
     * When a record is specified that doesn't match any custom templates, GET
     * should render the default template.
     */
    public function testDefaultItemTemplate()
    {

        $exhibit    = $this->_exhibit('no-custom-theme');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // Load the item body.
        $this->request->setQuery(array('record' => $record->id));
        $this->dispatch('neatline/items/'.$item->id);

        // Should render the default template.
        $body = trim($this->_getResponseBody());
        $this->assertEquals($item->id, $body);

    }


    /**
     * When a record isn't specified , GET should render the default template.
     */
    public function testNoRecordPassed()
    {

        $item = $this->_item();

        // No record specified.
        $this->dispatch('neatline/items/'.$item->id);

        // Should render the default template.
        $body = trim($this->_getResponseBody());
        $this->assertEquals($item->id, $body);

    }


}
