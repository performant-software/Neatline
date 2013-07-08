<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordTitle extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessRecordTitle.items');
        $this->_loadFixture('ProcessRecordTitle.texts');
        $this->_loadFixture('ProcessRecordTitle.records');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If the record does not have a parent item, the extant `title` field
     * should be migrated directly to the new `title` field.
     */
    public function testNoParentItem()
    {
        $this->assertEquals(
            $this->_records->find(32)->title, 'No Parent'
        );
    }


    /**
     * If the record has a parent item and the `title` field is defined on
     * the record, the existing value should be migrated directly.
     */
    public function testParentItemLocalValue()
    {
        $this->assertEquals(
            $this->_records->find(33)->title, 'Overridden Item Title'
        );
    }


    /**
     * If the record has a parent item and `title` is null, use the Dublin
     * Core "Title" field on the item.
     */
    public function testParentItemNoLocalValue()
    {
        $this->assertEquals(
            $this->_records->find(34)->title, 'Inherited Item Title'
        );
    }


}
