<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessBody extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessBody.records.json');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If the record does not have a parent item, the extant `description`
     * field should be migrated directly to the new `body` field.
     */
    public function testNoParentItem()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('No Parent')->body,
            'No parent body.'
        );
    }


    /**
     * If the record has a parent item and `use_dc_metadata` is true, the
     * `description` field should be migrated directly.
     */
    public function testParentItemUseDcMetadataDisabled()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('DC Disabled')->body,
            'DC disabled body.'
        );
    }


    /**
     * If the record has a parent item and `use_dc_metadata` is false, the
     * parent item's metadata output should be migrated.
     */
    public function testParentItemUseDcMetadataEnabled()
    {
        $this->assertRegExp(
            '/item\n/',
            $this->_getRecordByTitle('DC Enabled')->body
        );
    }


}
