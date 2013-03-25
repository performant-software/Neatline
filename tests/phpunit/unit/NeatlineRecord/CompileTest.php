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
     * Register the mock script path.
     */
    public function setUp()
    {
        parent::setUp();
        get_view()->addScriptPath(NL_DIR . '/tests/phpunit/mocks/tmpl');
    }


    /**
     * `compile` should write the DC "Title" element on the parent item to
     * `title` and the compiled metadata output to `body`.
     */
    public function testCompile()
    {

        $exhibit = $this->__exhibit();
        $item = $this->__item('title');

        $record = new NeatlineRecord($exhibit, $item);
        $record->compile();

        // Title and body should be set.
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->body, $record->getItemBody());

    }


}
