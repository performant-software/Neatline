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
     * `nl_getItemMarkup` should try to match `item-[tag]` templates in
     * the exhibit-specific theme first; if more than one tag on the
     * record has a corresponding template, the template for the leftmost
     * tag in the list should take precedence.
     */
    public function testTagTemplate()
    {

        $exhibit = $this->__exhibit('custom');
        $r = $this->__record($exhibit);

        // `tag1` first.
        $r->tags = 'tag1,tag2';
        $this->assertRegExp('/custom-item-tag1\n/', nl_getItemMarkup($r));

        // `tag2` first.
        $r->tags = 'tag2,tag1';
        $this->assertRegExp('/custom-item-tag2\n/', nl_getItemMarkup($r));

    }


    /**
     * When none of the `item-[tag]` templates matches the record, try to
     * render an `item` template in the exhibit-specific theme.
     */
    public function testSlugTemplate()
    {

        $exhibit = $this->__exhibit('custom');
        $r = $this->__record($exhibit);

        // No tags.
        $this->assertRegExp('/custom-item\n/', nl_getItemMarkup($r));

        // No matching tags.
        $record->tags = 'tag3';
        $this->assertRegExp('/custom-item\n/', nl_getItemMarkup($r));

    }


    /**
     * When none of the custom templates in the exhibit-specific theme
     * matches, fall back to the default `item` template, defined either 
     * in the theme or the core plugin.
     */
    public function testDefaultTemplate()
    {

        $exhibit = $this->__exhibit('no-custom-theme');
        $r = $this->__record($exhibit);

        // No custom templates.
        $this->assertRegExp('/item\n/', nl_getItemMarkup($r));

    }


}
