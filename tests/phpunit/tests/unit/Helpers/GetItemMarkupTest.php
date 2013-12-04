<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

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
        $this->_mockTheme();
    }


    /**
     * `nl_getItemMarkup` should first try to match `item-[tag]` templates in
     * the exhibit-specific theme; if more than one tag on the record has a
     * corresponding template, the template for the leftmost tag in the list
     * should take precedence.
     */
    public function testTagTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // `tag1` first.
        $record->tags = 'tag1,tag2';
        $markup = nl_getItemMarkup($record);
        $this->assertRegExp("/custom-{$item->id}-tag1/", $markup);

        // `tag2` first.
        $record->tags = 'tag2,tag1';
        $markup = nl_getItemMarkup($record);
        $this->assertRegExp("/custom-{$item->id}-tag2/", $markup);

    }


    /**
     * If none of the `item-[tag]` templates matche the record, try to render
     * an `item` template in the exhibit-specific theme.
     */
    public function testSlugTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // No tags.
        $markup = nl_getItemMarkup($record);
        $this->assertRegExp("/custom-{$item->id}/", $markup);

        // No matching tags.
        $record->tags = 'tag3';
        $markup = nl_getItemMarkup($record);
        $this->assertRegExp("/custom-{$item->id}/", $markup);

    }


    /**
     * When none of the templates in the exhibit-specific theme matches the
     * record, revert to the global `item` template, which is provided by the
     * core plugin and can also be overridden in the theme.
     */
    public function testDefaultTemplate()
    {

        $exhibit    = $this->_exhibit('no-custom-theme');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // No custom templates.
        $markup = nl_getItemMarkup($record);
        $this->assertRegExp("/{$item->id}/", $markup);

    }


}
