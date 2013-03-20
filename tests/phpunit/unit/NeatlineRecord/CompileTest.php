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
     * The `item_title` field should be updated with the current Dublin
     * Core "Title" field on the parent item.
     */
    public function testItemTitle()
    {

        $exhibit    = $this->__exhibit();
        $item       = $this->__item('title');
        $record     = new NeatlineRecord($exhibit, $item);
        $record->compile();

        // Item title should be set.
        $this->assertEquals($record->item_title, 'title');

    }


}
