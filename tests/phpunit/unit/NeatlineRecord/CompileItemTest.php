<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_CompileItem extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_mockTheme();
    }


    /**
     * `compileItem` should write the "Title" element on the parent item to
     * `title` and the full metadata output to `body`.
     */
    public function testCompileItem()
    {

        $exhibit    = $this->_exhibit();
        $item       = $this->_item('title');

        $record = new NeatlineRecord($exhibit, $item);
        $record->save();

        // `title` and `body` should be set.
        $this->assertEquals($item->id, nl_getItemMarkup($record));
        $this->assertEquals('title', $record->title);

    }


}
