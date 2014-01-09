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
     * First, match `item-[tag]` templates in the exhibit theme. If a template
     * exists for more than one tag, the left-most tag takes precedence.
     */
    public function testRecordTagTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // `tag1` first.
        $record->tags = 'tag1,tag2';
        $markup = nl_getItemMarkup($item, $record);
        $this->assertEquals("custom-{$item->id}-tag1", trim($markup));

        // `tag2` first.
        $record->tags = 'tag2,tag1';
        $markup = nl_getItemMarkup($item, $record);
        $this->assertEquals("custom-{$item->id}-tag2", trim($markup));

    }


    /**
     * If none of the `item-[tag]` templates matche the record, try to render
     * an `item` template in the exhibit-specific theme.
     */
    public function testExhibitSlugTemplate()
    {

        $exhibit    = $this->_exhibit('custom');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // No tags.
        $markup = nl_getItemMarkup($item, $record);
        $this->assertEquals("custom-{$item->id}", trim($markup));

        // No matching tags.
        $record->tags = 'tag3';
        $markup = nl_getItemMarkup($item, $record);
        $this->assertEquals("custom-{$item->id}", trim($markup));

    }


    /**
     * When no record is passed, or when a record is passed that doesn't match
     * any custom templates, render the `item.php` template, which is provided
     * in the plugin core and can be overridden in the theme.
     */
    public function testDefaultItemTemplate()
    {

        $exhibit    = $this->_exhibit('no-custom-theme');
        $item       = $this->_item();
        $record     = $this->_record($exhibit, $item);

        // No record passed.
        $markup = nl_getItemMarkup($item);
        $this->assertEquals($item->id, trim($markup));

        // No exhibit/record-specific templates.
        $markup = nl_getItemMarkup($item, $record);
        $this->assertEquals($item->id, trim($markup));

    }


}
