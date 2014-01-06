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
     * GET should emit the item metadata HTML for the item associated with the
     * Neatline record with the passed ID.
     */
    public function testGet()
    {

        $record = $this->_record();
        $item1  = $this->_item();
        $item2  = $this->_item();

        // Request item 1 output.
        $this->dispatch('neatline/items/'.$item1->id.'/record/'.$record->id);
        $record->item_id = $item1->id;

        $this->assertEquals(
            // Should emit item 1 HTML.
            nl_getItemMarkup($record), $this->_getResponseBody()
        );

        $this->resetRequest();
        $this->resetResponse();

        // Request item 2 output.
        $this->dispatch('neatline/items/'.$item2->id.'/record/'.$record->id);
        $record->item_id = $item2->id;

        $this->assertEquals(
            // Should emit item 2 HTML.
            nl_getItemMarkup($record), $this->_getResponseBody()
        );

    }


}
