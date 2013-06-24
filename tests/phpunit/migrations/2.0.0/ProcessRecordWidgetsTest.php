<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordWidgets
    extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessWidgets.records');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If the old record was not activated on any of the viewports, the
     * new `widgets` field should be empty.
     */
    public function testNone()
    {
        $this->assertNull(
            $this->_getRecordByTitle('None')->widgets
        );
    }


    /**
     * If the old record was activated on the item panel, the `Waypoints`
     * tag should be applied to `widgets`.
     */
    public function testItems()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('Items')->widgets,
            'Waypoints'
        );
    }


    /**
     * If the old record was activated on the timeline, the `Simile` tag
     * should be applied to `widgets`.
     */
    public function testTimeline()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('Timeline')->widgets,
            'Simile'
        );
    }


    /**
     * If the old record was active on both viewports, both tags should be
     * applied to `widgets`.
     */
    public function testBoth()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('Both')->widgets,
            'Waypoints,Simile'
        );
    }


}
