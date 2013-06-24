<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessExhibitWidgets
    extends Neatline_Case_Migrate200
{


    /**
     * The old `is_items` and `is_timeline` flags should be converted to
     * the new `Waypoints` and `Simile` slugs on the new exhibits.
     */
    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessExhibitWidgets.exhibits');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If just the map was activated, `widgets` should be empty.
     */
    public function testJustMap()
    {
        $this->assertNull(
            $this->_getExhibitByTitle('Map')->widgets
        );
    }


    /**
     * If the timeline was activated, `Simile` should be present.
     */
    public function testMapTimeline()
    {
        $this->assertEquals(
            $this->_getExhibitByTitle('Map, Timeline')->widgets,
            'Simile'
        );
    }


    /**
     * If the item browser was activated, `Waypoints` should be present.
     */
    public function testMapItems()
    {
        $this->assertEquals(
            $this->_getExhibitByTitle('Map, Items')->widgets,
            'Waypoints'
        );
    }


    /**
     * If the timeline and items were activated, `Simile` and `Waypoints`
     * should be present.
     */
    public function testMapTimelineItems()
    {
        $this->assertEquals(
            $this->_getExhibitByTitle('Map, Timeline, Items')->widgets,
            'Waypoints,Simile'
        );
    }


}
