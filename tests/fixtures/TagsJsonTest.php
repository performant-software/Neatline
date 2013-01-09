<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generators for the tags API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagsJsonFixtureTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * Tag collection JSON (GET response):
     *
     * `tags.standard.json`
     */
    public function testTagsJson()
    {

        // Exhibit and tags.
        $exhibit = $this->__exhibit();
        $tag1 = $this->__tag($exhibit, 'tag1', true);
        $tag1 = $this->__tag($exhibit, 'tag2', true);
        $tag1 = $this->__tag($exhibit, 'tag3', true);

        // Write the fixture.
        $this->writeFixture('neatline/tags/'.$exhibit->id,
            'tags.standard.json');

    }


}
