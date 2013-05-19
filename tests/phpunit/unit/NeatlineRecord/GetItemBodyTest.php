<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_GetItemBody extends Neatline_TestCase
{


    /**
     * Register the mock script path.
     */
    public function setUp()
    {
        parent::setUp();
        get_view()->addScriptPath(NL_DIR . '/tests/phpunit/mocks/theme');
    }


    /**
     * `getItemBody` should match `item-[slug]-[tag]` templates first; if
     * more than one tag on the record has a tag-specific template, the
     * template for the leftmost tag in the list should take precedence.
     */
    public function testExhibitTagTemplate()
    {

        $exhibit = $this->__exhibit('slug');
        $record = $this->__record($exhibit);

        // `tag1` before `tag2`.
        $record->tags = 'tag1,tag2';
        $this->assertRegExp('/item-slug-tag1\n/', $record->getItemBody());

        // `tag2` before `tag1`.
        $record->tags = 'tag2,tag1';
        $this->assertRegExp('/item-slug-tag2\n/', $record->getItemBody());

    }


    /**
     * When none of the `item-[slug]-[tag]` templates match, `getItemBody`
     * should try to load an exhibit-specific template.
     */
    public function testExhibitTemplate()
    {

        $exhibit = $this->__exhibit('slug');
        $record = $this->__record($exhibit);

        // No tags.
        $this->assertRegExp('/item-slug\n/', $record->getItemBody());

        // No matching tags.
        $record->tags = 'tag3';
        $this->assertRegExp('/item-slug\n/', $record->getItemBody());

    }


    /**
     * When none of the custom templates match, `getItemBody` should load
     * the default `item` template.
     */
    public function testTagTemplate()
    {

        $exhibit = $this->__exhibit('another-slug');
        $record = $this->__record($exhibit);

        // `tag1` before `tag2`.
        $record->tags = 'tag1,tag2';
        $this->assertRegExp('/item-tag1\n/', $record->getItemBody());

        // `tag2` before `tag1`.
        $record->tags = 'tag2,tag1';
        $this->assertRegExp('/item-tag2\n/', $record->getItemBody());

    }


    /**
     * When none of the custom templates match, `getItemBody` should load
     * the default `item` template.
     */
    public function testDefaultTemplate()
    {

        $exhibit = $this->__exhibit('another-slug');
        $record = $this->__record($exhibit);

        // No tag- or slug-specific templates.
        $this->assertRegExp('/item\n/', $record->getItemBody());

    }


}
