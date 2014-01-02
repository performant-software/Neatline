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


    /**
     * GET should emit the item metadata HTML for the item associated with the
     * Neatline record with the passed ID.
     */
    public function testGet()
    {

        $item   = $this->_item();
        $record = $this->_record(null, $item);

        $this->dispatch('neatline/items/'.$record->id);

        $this->assertEquals(
            // Should emit parent item HTML.
            nl_getItemMarkup($record), $this->_getResponseBody()
        );

    }


}
