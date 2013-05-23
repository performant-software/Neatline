<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileItem extends Neatline_DefaultCase
{


    public function setUp()
    {
        parent::setUp();
        $this->mockTheme();
    }


    /**
     * `compileItem` should write the "Title" element on the parent item
     * to `title` and the full metadata output to `body`.
     */
    public function testCompileItem()
    {

        $exhibit = $this->__exhibit('slug');
        $item = $this->__item('title');

        $record = new NeatlineRecord($exhibit, $item);
        $record->compileItem();

        // `title` and `body` should be set.
        $this->assertRegExp('/item-slug\n/', nl_getItemMarkup($record));
        $this->assertEquals($record->title, 'title');

    }


}
