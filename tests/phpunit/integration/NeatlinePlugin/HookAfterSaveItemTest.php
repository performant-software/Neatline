<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlinePluginTest_HookAfterSaveItem extends Neatline_TestCase
{


    public function setUp()
    {
        parent::setUp();
        $this->mockTheme();
    }


    /**
     * `hookAfterSaveItem` should update records that reference the item.
     */
    public function testHookAfterSaveItem()
    {

        $exhibit    = $this->__exhibit('slug');
        $item       = $this->__item('title');
        $record     = $this->__record($exhibit, $item);

        // Update the item.
        update_item($item, array(), array(
            'Dublin Core' => array (
                'Title' => array(
                    array('text' => 'title', 'html' => false)
                )
            )
        ));

        // Record should be compiled.
        $record = $this->reload($record);
        $this->assertRegExp('/item-slug\n/', $record->getItemBody());
        $this->assertEquals($record->title, 'title');

    }


}
