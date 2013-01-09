<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generators for the tag API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagJsonFixtureTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * JSON for new tag (POST response):
     *
     * `tag.standard.json`
     */
    public function testTagJson()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag', true);

        // Write the fixture.
        $this->writeFixture('neatline/tag/'.$tag->id,
            'tag.standard.json');

    }


    /**
     * JSON for new tag (POST response):
     *
     * `tag.add.json`
     */
    public function testNewTagJson()
    {
        $exhibit = $this->__exhibit();
        $this->request->setMethod('POST');
        $this->writeFixture('neatline/tags/'.$exhibit->id,
            'tag.add.json');
    }


}
