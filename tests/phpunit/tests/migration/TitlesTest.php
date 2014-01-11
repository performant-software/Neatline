<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class MigrateTest_Titles extends Neatline_Case_Migrate
{


    public function setUp()
    {
        parent::setUp();
        $this->_loadFixture('records');
        $this->_upgrade();
    }


    /**
     * Records that aren't linked to Omeka items shouldn't be changed.
     */
    public function testDontChangeRecordsWithoutParentItems()
    {
        $record = $this->_getRecordBySlug('no-parent-item');
        $this->assertEquals('No parent item title', $record->title);
        $this->assertEquals('No parent item body', $record->body);
    }


    /**
     * The `title` field for records that are linked to Omeka items should be
     * moved into the new `item_title` field, and `title` should be cleared.
     */
    public function testPopulateItemTitleFields()
    {
        $record = $this->_getRecordBySlug('parent-item');
        $this->assertEquals('Parent item title', $record->item_title);
        $this->assertNull($record->title);
    }


    /**
     * The `body` field for records that are linked to Omeka items should be
     * emptied, since the compiled item content is not loaded on-demand.
     */
    public function testClearBodyFields()
    {
        $record = $this->_getRecordBySlug('parent-item');
        $this->assertNull($record->body);
    }


}
