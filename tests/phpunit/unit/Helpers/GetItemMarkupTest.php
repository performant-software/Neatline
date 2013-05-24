<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_GetItemMarkup extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->mockTheme();
    }


    /**
     * `nl_getItemMetadata` should match `item-[slug]-[tag]` files first;
     * if more than one tag on the record has a tag-specific template, the
     * template for the leftmost tag in the list should take precedence.
     */
    public function testSlugTagTemplate()
    {

        $exhibit = $this->__exhibit('slug');
        $r = $this->__record($exhibit);

        // `tag1` first.
        $r->tags = 'tag1,tag2';
        $this->assertRegExp('/item-slug-tag1\n/', nl_getItemMarkup($r));

        // `tag2` first.
        $r->tags = 'tag2,tag1';
        $this->assertRegExp('/item-slug-tag2\n/', nl_getItemMarkup($r));

    }


    /**
     * When none of the `item-[slug]-[tag]` templates matches the record,
     * `nl_getItemMetadata` try to match an `item-[slug]` template.
     */
    public function testSlugTemplate()
    {

        $exhibit = $this->__exhibit('slug');
        $r = $this->__record($exhibit);

        // No tags.
        $this->assertRegExp('/item-slug\n/', nl_getItemMarkup($r));

        // No matching tags.
        $record->tags = 'tag3';
        $this->assertRegExp('/item-slug\n/', nl_getItemMarkup($r));

    }


    /**
     * When none of the custom templates matches, `nl_getItemMetadata`
     * should render the default `item` template.
     */
    public function testDefaultTemplate()
    {

        $exhibit = $this->__exhibit('another-slug');
        $r = $this->__record($exhibit);

        // No custom templates.
        $this->assertRegExp('/item\n/', nl_getItemMarkup($r));

    }


}
