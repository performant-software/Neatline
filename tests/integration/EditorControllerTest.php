<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller integration tests.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */
?>

<?php

class Neatline_EditorControllerTest extends Omeka_Test_AppTestCase
{

    // Testing parameters.
    private static $__testParams = array(
        'title' => 'Test Title',
        'description' => 'Test description.',
        'start_date' => 'April 26, 1564',
        'start_time' => '6:00 AM',
        'end_date' => 'April 23, 1616',
        'end_time' => '6:00 AM',
        'vector_color' => '#ffffff',
        'left_percent' => 0,
        'right_percent' => 100,
        'geocoverage' => '[POINT(-1.0, 1.0)]',
        'space_active' => true,
        'time_active' => true
    );

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();
        $this->db = get_db();
        $this->_recordsTable = $this->db->getTable('NeatlineDataRecord');
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');

    }

    /**
     * The index view should render the base markup for the editing application.
     * If the exhibit has no map, then there should not be a map object in the view.
     *
     * @return void.
     */
    public function testIndexWithoutMap()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();

        // Hit the route and capture the view.
        $this->dispatch('neatline-exhibits/editor/' . $exhibit->id);
        $this->assertResponseCode(200);
        $v = __v();

        // Check for the template variables.
        $this->assertNotNull($v->neatline);
        $this->assertNotNull($v->neatlineData);
        $this->assertNull($v->map);

        // Check the construction of the data array.
        $this->assertFalse($v->neatlineData['public']);

        $this->assertEquals(
            $v->neatlineData['neatline']->id,
            $exhibit->id
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['timeline'],
            neatline_getTimelineDataUrl($exhibit->id)
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['map'],
            neatline_getMapDataUrl($exhibit->id)
        );

        $this->assertEquals(
            $v->neatlineData['dataSources']['undated'],
            neatline_getUndatedItemsDataUrl($exhibit->id)
        );

    }

    /**
     * The index view should render the base markup for the editing application.
     * If the exhibit has a Geoserver-based map, then the map object in the view.
     *
     * @return void.
     */
    public function testIndexWithGeoserverMap()
    {



    }

    /**
     * The index view should render the base markup for the editing application.
     * If the exhibit has a file-based map, then the map object in the view.
     *
     * @return void.
     */
    public function testIndexWithFileMap()
    {



    }

    /**
     * When Omeka records exist but Neatline-endemic records do not exist, /items
     * should return the Omeka items without the Neatline Records heading.
     *
     * @return void.
     */
    public function testItemsWithOmekaRecords()
    {

        // Get rid of the default item.
        $this->db->getTable('Item')->find(1)->delete();

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'neatline_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/items');
        $this->assertQueryContentContains('tr.header-row td', 'Omeka Records');
        $this->assertNotQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryCount('tr.item-row', 1);

    }

    /**
     * When Omeka records do not exist but Neatline-endemic records do exist, /items
     * should return the Neatline records without the Omeka Records heading.
     *
     * @return void.
     */
    public function testItemsWithNeatlineRecords()
    {

        // Get rid of the default item.
        $this->db->getTable('Item')->find(1)->delete();

        // Create item, exhibit, and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);
        $record->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'neatline_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/items');
        $this->assertNotQueryContentContains('tr.header-row td', 'Omeka Records');
        $this->assertQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryCount('tr.item-row', 1);

    }

    /**
     * When Omeka records and Neatline-endemic records exist, /items should return
     * all records with both headings.
     *
     * @return void.
     */
    public function testItemsWithNeatlineRecordsAndOmekaRecords()
    {

        // Get rid of the default item.
        $this->db->getTable('Item')->find(1)->delete();

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord($item, $neatline);
        $record1->save();
        $record2 = new NeatlineDataRecord(null, $neatline);
        $record2->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'neatline_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/items');
        $this->assertQueryContentContains('tr.header-row td', 'Omeka Records');
        $this->assertQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryCount('tr.item-row', 2);

    }

    /**
     * Hitting the /status route with a well-formed POST should result in the
     * correct data commits to the space_active field in the correct record.
     *
     * @return void.
     */
    public function testSpaceStatusSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_or_time' => 'space',
                'value' => 'true'
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/status');

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 0);

    }

    /**
     * Hitting the /status route with a well-formed POST should result in the
     * correct data commits to the time_active field in the correct record.
     *
     * @return void.
     */
    public function testTimeStatusSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_or_time' => 'time',
                'value' => 'true'
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/status');

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Time status should be true, space status unchanged.
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->space_active, 0);

    }

    /**
     * When there is a Neatline-native data record, the /form route should output
     * a well-formed JSON object with the correct record attributes.
     *
     * @return void.
     */
    public function testForm()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            self::$__testParams['title'],
            self::$__testParams['description'],
            self::$__testParams['start_date'],
            self::$__testParams['start_time'],
            self::$__testParams['end_date'],
            self::$__testParams['end_time'],
            self::$__testParams['vector_color'],
            self::$__testParams['left_percent'],
            self::$__testParams['right_percent'],
            self::$__testParams['geocoverage'],
            self::$__testParams['space_active'],
            self::$__testParams['time_active']
        );

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/form');
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertEquals(
            $response,
            '{"title":"' . self::$__testParams['title'] . '",' .
            '"description":"' . self::$__testParams['description'] . '",' .
            '"start_date":"' . self::$__testParams['start_date'] . '",' .
            '"start_time":"' . self::$__testParams['start_time'] . '",' .
            '"end_date":"' . self::$__testParams['end_date'] . '",' .
            '"end_time":"' . self::$__testParams['end_time'] . '",' .
            '"left_percent":' . self::$__testParams['left_percent'] . ',' .
            '"right_percent":' . self::$__testParams['right_percent'] . ',' .
            '"vector_color":"' . self::$__testParams['vector_color'] . '"}'
        );

    }

    /**
     * When form data is saved via the /save route, the controller should return a
     * JSON string that reports the final space and time active statuses that resulted
     * from the data commit.
     *
     * @return void.
     */
    public function testSave()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            null,
            null,
            'June 25, 1987',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        );

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'neatline_id' => $neatline->id,
                'space_active' => 'false',
                'time_active' => 'false',
                'geocoverage' => 'POINT(0,1)',
                'title' => '',
                'description' => '',
                'start_date' => 'December, 2011',
                'start_time' => '',
                'end_date' => '',
                'end_time' => '',
                'left_percent' => 0,
                'right_percent' => 100,
                'vector_color' => ''
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/save');
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertEquals(
            $response,
            '{"space":true,"time":true}'
        );

    }

    /**
     * When ordeirng data is saved via the /order route, data records should
     * updated correctly with the new order integers.
     *
     * @return void.
     */
    public function testOrder()
    {

        // Create an exhibit, items, and records.
        $neatline = $this->helper->_createNeatline();
        $item1 = $this->helper->_createItem();
        $item2 = $this->helper->_createItem();
        $item3 = $this->helper->_createItem();
        $item4 = $this->helper->_createItem();
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);
        $record3 = new NeatlineDataRecord($item3, $neatline);
        $record4 = new NeatlineDataRecord($item4, $neatline);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $neatline->id,
                'order' => array(
                    $item1->id => 3,
                    $item2->id => 2,
                    $item3->id => 1,
                    $item4->id => 0
                )
            )
        );

        // Hit the order save route.
        $this->dispatch('neatline-exhibits/editor/order');

        // Reget the items.
        $record1 = $this->_recordsTable->getRecordByItemAndExhibit($item1, $neatline);
        $record2 = $this->_recordsTable->getRecordByItemAndExhibit($item2, $neatline);
        $record3 = $this->_recordsTable->getRecordByItemAndExhibit($item3, $neatline);
        $record4 = $this->_recordsTable->getRecordByItemAndExhibit($item4, $neatline);

        // Check the values.
        $this->assertEquals($record1->display_order, 3);
        $this->assertEquals($record2->display_order, 2);
        $this->assertEquals($record3->display_order, 1);
        $this->assertEquals($record4->display_order, 0);

    }

    /**
     * When a new arrangement configuration saved via the /arrangement route, the
     * exhibit record should be updated and the view should return a json-encoded
     * representation of the updated exhibit record.
     *
     * @return void.
     */
    public function testArrangement()
    {

        // Create an exhibit.
        $exhibit =                              new NeatlineExhibit();
        $exhibit->name =                        'Test Title';
        $exhibit->is_map =                      0;
        $exhibit->is_timeline =                 0;
        $exhibit->is_undated_items =            0;
        $exhibit->top_element =                 'timeline';
        $exhibit->undated_items_position =      'left';
        $exhibit->undated_items_height =        'partial';
        $exhibit->added =                       '1000-00-00 00:00:00';
        $exhibit->map_id =                      1;
        $exhibit->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $exhibit->id,
                'is_map' => 1,
                'is_timeline' => 1,
                'is_undated_items' => 1,
                'top_element' => 'map',
                'udi_position' => 'right',
                'udi_height' => 'full'
            )
        );

        // Hit the arrangement save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/arrangement');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->is_map, 1);
        $this->assertEquals($exhibit->is_timeline, 1);
        $this->assertEquals($exhibit->is_undated_items, 1);
        $this->assertEquals($exhibit->top_element, 'map');
        $this->assertEquals($exhibit->undated_items_position, 'right');
        $this->assertEquals($exhibit->undated_items_height, 'full');

        // Check the JSON representation of the updated exhibit.
        $response = $this->getResponse()->getBody('default');
        $this->assertEquals(
            $response,
            '{"added":"0000-00-00 00:00:00",' .
            '"name":"Test Title",' .
            '"map_id":1,' .
            '"top_element":"map",' .
            '"undated_items_position":"right",' .
            '"undated_items_height":"full",' .
            '"is_map":1,' .
            '"is_timeline":1,' .
            '"is_undated_items":1,' .
            '"default_map_bounds":null,' .
            '"default_map_zoom":null,' .
            '"default_timeline_focus_date":null,' .
            '"id":1}'
        );

    }

    /**
     * When a new default map/timeline focus data is saved via the /positions
     * route, the corresponding attributes should be updated on the exhibit record.
     *
     * @return void.
     */
    public function testPositions()
    {

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $exhibit->id,
                'map_extent' => 'extent',
                'map_zoom' => 1,
                'timeline_center' => 'center'
            )
        );

        // Hit the positions save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/positions');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->default_map_bounds, 'extent');
        $this->assertEquals($exhibit->default_map_zoom, 1);
        $this->assertEquals($exhibit->default_timeline_focus_date, 'center');

    }

    /**
     * When a new item-specific map focus data is saved via the /focus route,
     * the corresponding attributes should be updated on the data record.
     *
     * @return void.
     */
    public function testFocusWithExistingRecord()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $exhibit->id,
                'item_id' => $item->id,
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/focus');
        $record = $this->_recordsTable->find($record->id);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);

    }

    /**
     * When a new item-specific map focus data is saved via the /focus route
     * and there is not an extant data record for the exhibit/item, create a
     * new item and set theattributes.
     *
     * @return void.
     */
    public function testFocusWithoutExistingRecord()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'neatline_id' => $exhibit->id,
                'item_id' => $item->id,
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/focus');
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $exhibit);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);

    }

    /**
     * The /add route should return markup for a new item row.
     *
     * @return void.
     */
    public function testAdd()
    {

        // Create an exhibit, item, and record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the route, check for the markup.
        $this->dispatch('neatline-exhibits/editor/add');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

    }

}
