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
        'stroke_color' => '#000000',
        'highlight_color' => '#000000',
        'vector_opacity' => 60,
        'stroke_opacity' => 40,
        'stroke_width' => 5,
        'point_radius' => 7,
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
                'exhibit_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row td', 'Omeka Records');
        $this->assertQueryContentContains('tr.header-row.hidden td', 'Neatline Records');
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
                'exhibit_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row.hidden td', 'Omeka Records');
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
                'exhibit_id' => $neatline->id,
                'all' => 'true'
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
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
    public function testSpaceStatusSaveWithExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => $record->id,
                'space_or_time' => 'space',
                'value' => 'true'
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/status');

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

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
    public function testTimeStatusSaveWithExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => $record->id,
                'space_or_time' => 'time',
                'value' => 'true'
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/status');

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Time status should be true, space status unchanged.
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->space_active, 0);

    }

    /**
     * Hitting the /status route with a well-formed POST when there is no existing
     * data record should create a new record, commit the status, and default in
     * DC values for title and description.
     *
     * @return void.
     */
    public function testSpaceStatusSaveWithNoExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => '',
                'space_or_time' => 'space',
                'value' => 'true'
            )
        );

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/status');

        // Should create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 0);

    }

    /**
     * Hitting the /status route with a well-formed POST when there is no existing
     * data record should create a new record, commit the status, and default in
     * DC values for title and description.
     *
     * @return void.
     */
    public function testTimeStatusSaveWithNoExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => '',
                'space_or_time' => 'time',
                'value' => 'true'
            )
        );

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/status');

        // Should create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 0);
        $this->assertEquals($record->time_active, 1);

    }

    /**
     * If there is an existing record for an item/exhibit and the /status route
     * is hit with a post that does not include a record id, the code should check
     * for the existing record before creating a new one.
     *
     * @return void.
     */
    public function testStatusSaveNoDuplication()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => '',
                'space_or_time' => 'time',
                'value' => 'true'
            )
        );

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/status');

        // Should create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 0);
        $this->assertEquals($record->time_active, 1);

    }

    /**
     * When there is a Neatline-native data record with data, the /form route
     * should output a well-formed JSON object with the correct record attributes.
     *
     * @return void.
     */
    public function testFormWithExistingRecordWithData()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Populate fields.
        $record->title =            self::$__testParams['title'];
        $record->description =      self::$__testParams['description'];
        $record->start_date =       self::$__testParams['start_date'];
        $record->start_time =       self::$__testParams['start_time'];
        $record->end_date =         self::$__testParams['end_date'];
        $record->end_time =         self::$__testParams['end_time'];
        $record->vector_color =     self::$__testParams['vector_color'];
        $record->stroke_color =     self::$__testParams['stroke_color'];
        $record->highlight_color =  self::$__testParams['highlight_color'];
        $record->vector_opacity =   self::$__testParams['vector_opacity'];
        $record->stroke_opacity =   self::$__testParams['stroke_opacity'];
        $record->stroke_width =     self::$__testParams['stroke_width'];
        $record->point_radius =     self::$__testParams['point_radius'];
        $record->left_percent =     self::$__testParams['left_percent'];
        $record->right_percent =    self::$__testParams['right_percent'];
        $record->geocoverage =      self::$__testParams['geocoverage'];
        $record->space_active =     self::$__testParams['space_active'];
        $record->time_active =      self::$__testParams['time_active'];
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => $record->id
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/form');
        $response = $this->getResponse()->getBody('default');

        // Test the construction.
        $this->assertContains(
            '"title":"' . self::$__testParams['title'] . '"',
            $response
        );

        $this->assertContains(
            '"description":"' . self::$__testParams['description'] . '"',
            $response
        );

        $this->assertContains(
            '"start_date":"' . self::$__testParams['start_date'] . '"',
            $response
        );

        $this->assertContains(
            '"start_time":"' . self::$__testParams['start_time'] . '"',
            $response
        );

        $this->assertContains(
            '"end_date":"' . self::$__testParams['end_date'] . '"',
            $response
        );

        $this->assertContains(
            '"end_time":"' . self::$__testParams['end_time'] . '"',
            $response
        );

        $this->assertContains(
            '"left_percent":' . self::$__testParams['left_percent'],
            $response
        );

        $this->assertContains(
            '"right_percent":' . self::$__testParams['right_percent'],
            $response
        );

        $this->assertContains(
            '"vector_color":"' . self::$__testParams['vector_color'] . '"',
            $response
        );

        $this->assertContains(
            '"stroke_color":"' . self::$__testParams['stroke_color'] . '"',
            $response
        );

        $this->assertContains(
            '"highlight_color":"' . self::$__testParams['highlight_color'] . '"',
            $response
        );

        $this->assertContains(
            '"vector_opacity":' . self::$__testParams['vector_opacity'],
            $response
        );

        $this->assertContains(
            '"stroke_width":' . self::$__testParams['stroke_width'],
            $response
        );

        $this->assertContains(
            '"point_radius":' . self::$__testParams['point_radius'],
            $response
        );

    }

    /**
     * When there is a Neatline-native data record without data, the /form route
     * should output a well-formed JSON object with the correct default attributes.
     *
     * @return void.
     */
    public function testFormWithExistingRecordWithoutData()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => $record->id
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/form');
        $response = $this->getResponse()->getBody('default');

        // Test the construction.
        $this->assertContains(
            '"title":""',
            $response
        );

        $this->assertContains(
            '"description":""',
            $response
        );

        $this->assertContains(
            '"start_date":""',
            $response
        );

        $this->assertContains(
            '"start_time":""',
            $response
        );

        $this->assertContains(
            '"end_date":""',
            $response
        );

        $this->assertContains(
            '"end_time":""',
            $response
        );

        $this->assertContains(
            '"left_percent":0',
            $response
        );

        $this->assertContains(
            '"right_percent":100',
            $response
        );

        $this->assertContains(
            '"vector_color":"' . get_option('vector_color') . '"',
            $response
        );

        $this->assertContains(
            '"stroke_color":"' . get_option('stroke_color') . '"',
            $response
        );

        $this->assertContains(
            '"highlight_color":"' . get_option('highlight_color') . '"',
            $response
        );

        $this->assertContains(
            '"vector_opacity":' . get_option('vector_opacity'),
            $response
        );

        $this->assertContains(
            '"stroke_width":' . get_option('stroke_width'),
            $response
        );

        $this->assertContains(
            '"point_radius":' . get_option('point_radius'),
            $response
        );

    }

    /**
     * When there is not a Neatline-native data record, the /form route should output
     * a well-formed JSON object that defaults in DC values for title and description.
     *
     * @return void.
     */
    public function testFormWithNoExistingRecord()
    {

        // Create item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Create element texts.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Title',
            'Test Title');

        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Description',
            'Test description.');

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => ''
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/form');
        $response = $this->getResponse()->getBody('default');

        // Check for proper construction.
        $this->assertContains(
            '"title":"Test Title"',
            $response
        );

        $this->assertContains(
            '"description":"Test description."',
            $response
        );

        $this->assertContains(
            '"start_date":""',
            $response
        );

        $this->assertContains(
            '"start_time":""',
            $response
        );

        $this->assertContains(
            '"end_date":""',
            $response
        );

        $this->assertContains(
            '"end_time":""',
            $response
        );

        $this->assertContains(
            '"left_percent":0',
            $response
        );

        $this->assertContains(
            '"right_percent":100',
            $response
        );

        $this->assertContains(
            '"vector_color":"' . get_option('vector_color') . '"',
            $response
        );

        $this->assertContains(
            '"stroke_color":"' . get_option('stroke_color') . '"',
            $response
        );

        $this->assertContains(
            '"highlight_color":"' . get_option('highlight_color') . '"',
            $response
        );

        $this->assertContains(
            '"vector_opacity":' . get_option('vector_opacity'),
            $response
        );

        $this->assertContains(
            '"stroke_width":' . get_option('stroke_width'),
            $response
        );

        $this->assertContains(
            '"point_radius":' . get_option('point_radius'),
            $response
        );

    }

    /**
     * When form data is saved via the /save route, the controller should return a
     * JSON string that reports the final space and time active statuses that resulted
     * from the data commit. If there is a non-null record id on the post and a null
     * item id, the action should update the correct item-less data record.
     *
     * @return void.
     */
    public function testSaveWithRecordIdAndNoItemId()
    {

        // Create exhibit and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            '',
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Test the raw construction with no available DC values.
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":' . $record->id, $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find($record->id);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->start_time,
            self::$__testParams['start_time']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->end_time,
            self::$__testParams['end_time']
        );

        $this->assertEquals(
            $record->vector_color,
            self::$__testParams['vector_color']
        );

        $this->assertEquals(
            $record->stroke_color,
            self::$__testParams['stroke_color']
        );

        $this->assertEquals(
            $record->highlight_color,
            self::$__testParams['highlight_color']
        );

        $this->assertEquals(
            $record->vector_opacity,
            self::$__testParams['vector_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->stroke_width,
            self::$__testParams['stroke_width']
        );

        $this->assertEquals(
            $record->point_radius,
            self::$__testParams['point_radius']
        );

        $this->assertEquals(
            $record->geocoverage,
            self::$__testParams['geocoverage']
        );

        $this->assertEquals(
            $record->left_percent,
            self::$__testParams['left_percent']
        );

        $this->assertEquals(
            $record->right_percent,
            self::$__testParams['right_percent']
        );

        $this->assertEquals(
            $record->space_active,
            1
        );

        $this->assertEquals(
            $record->time_active,
            1
        );

    }

    /**
     * If there is a non-null item id on the post and a null record id, the action
     * /save should create and populate a new data record.
     *
     * @return void.
     */
    public function testSaveWithItemIdAndNoRecordId()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Test the raw construction with no available DC values.
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":1', $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->start_time,
            self::$__testParams['start_time']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->end_time,
            self::$__testParams['end_time']
        );

        $this->assertEquals(
            $record->vector_color,
            self::$__testParams['vector_color']
        );

        $this->assertEquals(
            $record->stroke_color,
            self::$__testParams['stroke_color']
        );

        $this->assertEquals(
            $record->highlight_color,
            self::$__testParams['highlight_color']
        );

        $this->assertEquals(
            $record->vector_opacity,
            self::$__testParams['vector_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->stroke_width,
            self::$__testParams['stroke_width']
        );

        $this->assertEquals(
            $record->point_radius,
            self::$__testParams['point_radius']
        );

        $this->assertEquals(
            $record->geocoverage,
            self::$__testParams['geocoverage']
        );

        $this->assertEquals(
            $record->left_percent,
            self::$__testParams['left_percent']
        );

        $this->assertEquals(
            $record->right_percent,
            self::$__testParams['right_percent']
        );

        $this->assertEquals(
            $record->space_active,
            1
        );

        $this->assertEquals(
            $record->time_active,
            1
        );

    }

    /**
     * If there is a non-null item id on the post and a non-null record id, the action
     * /save should update the existing data record for the item.
     *
     * @return void.
     */
    public function testSaveWithItemIdAndRecordId()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Test the raw construction with 
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":' . $record->id, $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->start_time,
            self::$__testParams['start_time']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->end_time,
            self::$__testParams['end_time']
        );

        $this->assertEquals(
            $record->vector_color,
            self::$__testParams['vector_color']
        );

        $this->assertEquals(
            $record->stroke_color,
            self::$__testParams['stroke_color']
        );

        $this->assertEquals(
            $record->highlight_color,
            self::$__testParams['highlight_color']
        );

        $this->assertEquals(
            $record->vector_opacity,
            self::$__testParams['vector_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->stroke_width,
            self::$__testParams['stroke_width']
        );

        $this->assertEquals(
            $record->point_radius,
            self::$__testParams['point_radius']
        );

        $this->assertEquals(
            $record->geocoverage,
            self::$__testParams['geocoverage']
        );

        $this->assertNotNull(
            $record->geocoverage
        );

        $this->assertEquals(
            $record->left_percent,
            self::$__testParams['left_percent']
        );

        $this->assertEquals(
            $record->right_percent,
            self::$__testParams['right_percent']
        );

        $this->assertEquals(
            $record->space_active,
            1
        );

        $this->assertEquals(
            $record->time_active,
            1
        );

    }

    /**
     * When geocoverage => 'null' is posted to /save, the geocoverage  field
     * should not be set. This is the case when a user saves a form and there
     * is not an instantiated map in the exhibit. If there was a  map in the
     * past, though, and vectors were added for the item, those vectors would
     * otherwise be deleted, since the absence of the map at the time of save
     * would register in the front-end application as a wkt of 'null'.
     *
     * @return void.
     */
    public function testSaveNullStringGeocoverage()
    {

        // Create exhibit and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);
        $record->geocoverage = 'POINT(1,0)';
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>        '',
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        'null',
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find($record->id);
        $this->assertEquals($record->geocoverage, 'POINT(1,0)');
        $this->assertNotEquals($record->geocoverage, 'null');

    }

    /**
     * When /save is hit with a post that defines a item and but not a record id,
     * the code should check to make sure that there isn't actually an existing data
     * record for the item/exhibit combination before creating the new record. This
     * could be possible in some cases - for example, if the user has set a map focus
     * for a raw Omeka item, and then commits the form before reloading the item
     * list, which would update the record attributes on the row listing.
     *
     * @return void.
     */
    public function testDuplicateProtectionOnSave()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

    }

    /**
     * If there is a null geocoverage field and a hit to /save commits novel
     * coverage data, the space_active tracker on an existing record should
     * be flipped on.
     *
     * @return void.
     */
    public function testSpaceStatusActivationOnSaveWithExistingRecord()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // At the start, both trackers false.
        $this->assertFalse((bool) $record->space_active);
        $this->assertFalse((bool) $record->time_active);

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         '',
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertTrue((bool) $record->space_active);
        $this->assertFalse((bool) $record->time_active);

    }

    /**
     * If there is a null geocoverage field and a hit to /save commits novel
     * coverage data, the space_active tracker on a new record should be flipped on.
     *
     * @return void.
     */
    public function testSpaceStatusActivationOnSaveWithoutExistingRecord()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         '',
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find(1);
        $this->assertTrue((bool) $record->space_active);
        $this->assertFalse((bool) $record->time_active);

    }

    /**
     * If there is a null geocoverage field and a hit to /save commits novel
     * coverage data, the time_active tracker on an existing record should
     * be flipped on.
     *
     * @return void.
     */
    public function testTimeStatusActivationOnSaveWithExistingRecord()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // At the start, both trackers false.
        $this->assertFalse((bool) $record->space_active);
        $this->assertFalse((bool) $record->time_active);

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        '',
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertFalse((bool) $record->space_active);
        $this->assertTrue((bool) $record->time_active);

    }

    /**
     * If there is a null geocoverage field and a hit to /save commits novel
     * coverage data, the time_active tracker on a new record should be flipped on.
     *
     * @return void.
     */
    public function testTimeStatusActivationOnSaveWithoutExistingRecord()
    {

        // Create exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        '',
                'title' =>              self::$__testParams['title'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'start_time' =>         self::$__testParams['start_time'],
                'end_date' =>           self::$__testParams['end_date'],
                'end_time' =>           self::$__testParams['end_time'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius']
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find(1);
        $this->assertFalse((bool) $record->space_active);
        $this->assertTrue((bool) $record->time_active);

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
        $item5 = $this->helper->_createItem();
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);
        $record3 = new NeatlineDataRecord($item3, $neatline);
        $record4 = new NeatlineDataRecord($item4, $neatline);
        $record5 = new NeatlineDataRecord($item5, $neatline);
        $record1->space_active = 1;
        $record2->space_active = 1;
        $record3->space_active = 1;
        $record4->space_active = 1;
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();
        $record5->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $neatline->id,
                'order' => array(
                    $record1->id => 3,
                    $record2->id => 2,
                    $record3->id => 1,
                    $record4->id => 0
                )
            )
        );

        // Hit the order save route.
        $this->dispatch('neatline-exhibits/editor/ajax/order');

        // Reget the items.
        $record1 = $this->_recordsTable->getRecordByItemAndExhibit($item1, $neatline);
        $record2 = $this->_recordsTable->getRecordByItemAndExhibit($item2, $neatline);
        $record3 = $this->_recordsTable->getRecordByItemAndExhibit($item3, $neatline);
        $record4 = $this->_recordsTable->getRecordByItemAndExhibit($item4, $neatline);
        $record5 = $this->_recordsTable->getRecordByItemAndExhibit($item5, $neatline);

        // Check the values.
        $this->assertEquals($record1->display_order, 3);
        $this->assertEquals($record2->display_order, 2);
        $this->assertEquals($record3->display_order, 1);
        $this->assertEquals($record4->display_order, 0);
        $this->assertNull($record5->display_order);

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
        $exhibit->slug =                        'test-slug';
        $exhibit->public =                      1;
        $exhibit->is_map =                      0;
        $exhibit->is_timeline =                 0;
        $exhibit->is_items =                    0;
        $exhibit->top_element =                 'timeline';
        $exhibit->items_h_pos =                 'left';
        $exhibit->items_v_pos =                 'top';
        $exhibit->items_height =                'partial';
        $exhibit->h_percent =                   50;
        $exhibit->v_percent =                   50;
        $exhibit->added =                       '2011-12-05 09:16:00';
        $exhibit->map_id =                      1;
        $exhibit->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' =>                $exhibit->id,
                'is_map' =>                     1,
                'is_timeline' =>                1,
                'is_items' =>                   1,
                'top_element' =>                'map',
                'items_h_pos' =>                'right',
                'items_v_pos' =>                'bottom',
                'items_height' =>               'full',
                'h_percent' =>                  30,
                'v_percent' =>                  70
            )
        );

        // Hit the arrangement save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/ajax/arrangement');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->is_map, 1);
        $this->assertEquals($exhibit->is_timeline, 1);
        $this->assertEquals($exhibit->is_items, 1);
        $this->assertEquals($exhibit->top_element, 'map');
        $this->assertEquals($exhibit->items_h_pos, 'right');
        $this->assertEquals($exhibit->items_v_pos, 'bottom');
        $this->assertEquals($exhibit->items_height, 'full');
        $this->assertEquals($exhibit->h_percent, 30);
        $this->assertEquals($exhibit->v_percent, 70);

        // Check the JSON representation of the updated exhibit.
        $response = $this->getResponse()->getBody('default');
        $this->assertContains('"added":"2011-12-05 09:16:00"', $response);
        $this->assertContains('"name":"Test Title"', $response);
        $this->assertContains('"map_id":1', $response);
        $this->assertContains('"image_id":null', $response);
        $this->assertContains('"top_element":"map"', $response);
        $this->assertContains('"items_h_pos":"right"', $response);
        $this->assertContains('"items_v_pos":"bottom"', $response);
        $this->assertContains('"items_height":"full"', $response);
        $this->assertContains('"is_map":1', $response);
        $this->assertContains('"is_timeline":1', $response);
        $this->assertContains('"is_items":1', $response);
        $this->assertContains('"h_percent":30', $response);
        $this->assertContains('"v_percent":70', $response);
        $this->assertContains('"default_map_bounds":null', $response);
        $this->assertContains('"default_map_zoom":null', $response);
        $this->assertContains('"default_focus_date":null', $response);
        $this->assertContains('"default_vector_color":null', $response);
        $this->assertContains('"default_vector_opacity":null', $response);
        $this->assertContains('"default_stroke_color":null', $response);
        $this->assertContains('"default_stroke_opacity":null', $response);
        $this->assertContains('"default_stroke_width":null', $response);
        $this->assertContains('"default_point_radius":null', $response);
        $this->assertContains('"default_point_radius":null', $response);
        $this->assertContains('"id":1', $response);

    }

    /**
     * The arrangement action should not allow string-casted versions of
     * bitwise-booleans to be saved to the database.
     *
     * @return void.
     */
    public function testArrangementIntTypecasting()
    {

        // Create an exhibit.
        $exhibit =                              new NeatlineExhibit();
        $exhibit->name =                        'Test Title';
        $exhibit->slug =                        'test-slug';
        $exhibit->public =                      1;
        $exhibit->is_map =                      0;
        $exhibit->is_timeline =                 0;
        $exhibit->is_items =                    0;
        $exhibit->top_element =                 'timeline';
        $exhibit->items_h_pos =                 'left';
        $exhibit->items_v_pos =                 'top';
        $exhibit->items_height =                'partial';
        $exhibit->added =                       '2011-12-05 09:16:00';
        $exhibit->map_id =                      1;
        $exhibit->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' =>                $exhibit->id,
                'is_map' =>                     '1',
                'is_timeline' =>                '1',
                'is_items' =>                   '1',
                'top_element' =>                'map',
                'items_h_pos' =>                'right',
                'items_v_pos' =>                'bottom',
                'items_height' =>               'full',
                'h_percent' =>                  '30',
                'v_percent' =>                  '70'
            )
        );

        // Hit the arrangement save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/ajax/arrangement');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->is_map, 1);
        $this->assertEquals($exhibit->is_timeline, 1);
        $this->assertEquals($exhibit->is_items, 1);
        $this->assertEquals($exhibit->top_element, 'map');
        $this->assertEquals($exhibit->items_h_pos, 'right');
        $this->assertEquals($exhibit->items_v_pos, 'bottom');
        $this->assertEquals($exhibit->items_height, 'full');
        $this->assertEquals($exhibit->h_percent, 30);
        $this->assertEquals($exhibit->v_percent, 70);

        // Check the JSON representation of the updated exhibit.
        $response = $this->getResponse()->getBody('default');
        $this->assertContains('"added":"2011-12-05 09:16:00"', $response);
        $this->assertContains('"name":"Test Title"', $response);
        $this->assertContains('"map_id":1', $response);
        $this->assertContains('"image_id":null', $response);
        $this->assertContains('"top_element":"map"', $response);
        $this->assertContains('"items_h_pos":"right"', $response);
        $this->assertContains('"items_v_pos":"bottom"', $response);
        $this->assertContains('"items_height":"full"', $response);
        $this->assertContains('"is_map":1', $response);
        $this->assertContains('"is_timeline":1', $response);
        $this->assertContains('"is_items":1', $response);
        $this->assertContains('"h_percent":30', $response);
        $this->assertContains('"v_percent":70', $response);
        $this->assertContains('"default_map_bounds":null', $response);
        $this->assertContains('"default_map_zoom":null', $response);
        $this->assertContains('"default_focus_date":null', $response);
        $this->assertContains('"default_vector_color":null', $response);
        $this->assertContains('"default_vector_opacity":null', $response);
        $this->assertContains('"default_stroke_color":null', $response);
        $this->assertContains('"default_stroke_opacity":null', $response);
        $this->assertContains('"default_stroke_width":null', $response);
        $this->assertContains('"default_point_radius":null', $response);
        $this->assertContains('"default_point_radius":null', $response);
        $this->assertContains('"id":1', $response);

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
                'exhibit_id' => $exhibit->id,
                'map_extent' => 'extent',
                'map_zoom' => 1,
                'timeline_center' => 'center',
                'timeline_zoom' => 10
            )
        );

        // Hit the positions save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/ajax/positions');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->default_map_bounds, 'extent');
        $this->assertEquals($exhibit->default_map_zoom, 1);
        $this->assertEquals($exhibit->default_focus_date, 'center');
        $this->assertEquals($exhibit->default_timeline_zoom, 10);

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
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => $record->id,
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/ajax/focus');
        $record = $this->_recordsTable->find($record->id);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);
        $this->assertEquals($record->space_active, 1);

    }

    /**
     * When a new item-specific map focus data is saved via the /focus route
     * and there is not an extant data record for the exhibit/item, create a
     * new item and set the attributes.
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
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => '',
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/ajax/focus');
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $exhibit);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);
        $this->assertEquals($record->space_active, 1);

    }

    /**
     * When a new item-specific map focus data is saved via the /focus route
     * and there is an extant data record that does not have a parent item, the
     * record should be correctly updated.
     *
     * @return void.
     */
    public function testFocusWithNeatlineEndemicRecord()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => '',
                'record_id' => $record->id,
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/ajax/focus');
        $record = $this->_recordsTable->find($record->id);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);
        $this->assertEquals($record->space_active, 1);

    }

    /**
     * If there is an existing data record for an item/exhibit and the /focus
     * route is hit with a post that specifies an item id but not a record id, the
     * code should check for the existing record before creating a new one.
     *
     * @return void.
     */
    public function testFocusNoDuplication()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => '',
                'extent' => 'BOUNDS()',
                'zoom' => 5
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the focus route, reget the record.
        $this->dispatch('neatline-exhibits/editor/ajax/focus');
        $record = $this->_recordsTable->find($record->id);

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check the attributes.
        $this->assertEquals($record->map_bounds, 'BOUNDS()');
        $this->assertEquals($record->map_zoom, 5);
        $this->assertEquals($record->space_active, 1);

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

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'exhibit_id' => $neatline->id
            )
        );

        // 0 records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Hit the route, check for the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/add');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check identity.
        $newRecord = $this->_recordsTable->find(1);
        $this->assertEquals($newRecord->exhibit_id, $neatline->id);

    }

    /**
     * The /delete route should delete a Neatline-endemic data record.
     *
     * @return void.
     */
    public function testDelete()
    {

        // Create an exhibit and records.
        $neatline = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();
        $record2 = new NeatlineDataRecord(null, $neatline);
        $record2->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'record_id' => $record1->id
            )
        );

        // 2 records.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Hit the route, check for the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/delete');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check that the right record was deleted.
        $this->assertNull($this->_recordsTable->find($record1->id));
        $this->assertNotNull($this->_recordsTable->find($record2->id));


    }

    /**
     * The /mapsettings route should commit row-level style defaults on
     * the exhibit record when they do not match the system defaults.
     *
     * @return void.
     */
    public function testMapSettingsWithNovelValues()
    {

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('highlight_color', '#000000');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'vector_color' => '#ffffff',
                'stroke_color' => '#ffffff',
                'highlight_color' => '#ffffff',
                'vector_opacity' => 5,
                'stroke_opacity' => 5,
                'stroke_width' => 5,
                'point_radius' => 5,
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNotNull($exhibit->default_vector_color);
        $this->assertEquals($exhibit->default_vector_color, '#ffffff');
        $this->assertNotNull($exhibit->default_stroke_color);
        $this->assertEquals($exhibit->default_stroke_color, '#ffffff');
        $this->assertNotNull($exhibit->default_highlight_color);
        $this->assertEquals($exhibit->default_highlight_color, '#ffffff');
        $this->assertNotNull($exhibit->default_vector_opacity);
        $this->assertEquals($exhibit->default_vector_opacity, 5);
        $this->assertNotNull($exhibit->default_stroke_opacity);
        $this->assertEquals($exhibit->default_stroke_opacity, 5);
        $this->assertNotNull($exhibit->default_stroke_width);
        $this->assertEquals($exhibit->default_stroke_width, 5);
        $this->assertNotNull($exhibit->default_point_radius);
        $this->assertEquals($exhibit->default_point_radius, 5);
        $this->assertEquals($exhibit->default_base_layer, 1);

    }

    /**
     * The /mapsettings route should not commit row-level style defaults on
     * the exhibit record when they match the system defaults.
     *
     * @return void.
     */
    public function testMapSettingsWithNonNovelValues()
    {

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'vector_color' => get_option('vector_color'),
                'vector_opacity' => get_option('vector_opacity'),
                'stroke_color' => get_option('stroke_color'),
                'highlight_color' => get_option('highlight_color'),
                'stroke_opacity' => get_option('stroke_opacity'),
                'stroke_width' => get_option('stroke_width'),
                'point_radius' => get_option('point_radius'),
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNull($exhibit->default_vector_color);
        $this->assertNull($exhibit->default_stroke_color);
        $this->assertNull($exhibit->default_highlight_color);
        $this->assertNull($exhibit->default_vector_opacity);
        $this->assertNull($exhibit->default_stroke_opacity);
        $this->assertNull($exhibit->default_stroke_width);
        $this->assertNull($exhibit->default_point_radius);
        $this->assertEquals($exhibit->default_base_layer, 1);

    }

    /**
     * The /mapsettings route should null out set row-level style defaults on
     * the exhibit record when new values match the system defaults.
     *
     * @return void.
     */
    public function testMapSettingsWithNonNovelValuesAndSetRowValues()
    {

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();
        $exhibit->default_vector_color = '#000000';
        $exhibit->default_stroke_color = '#000000';
        $exhibit->default_vector_opacity = 1;
        $exhibit->default_stroke_opacity = 1;
        $exhibit->default_stroke_width = 1;
        $exhibit->default_point_radius = 1;
        $exhibit->save();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('highlight_color', '#000000');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'vector_color' => get_option('vector_color'),
                'stroke_color' => get_option('stroke_color'),
                'highlight_color' => get_option('highlight_color'),
                'vector_opacity' => get_option('vector_opacity'),
                'stroke_opacity' => get_option('stroke_opacity'),
                'stroke_width' => get_option('stroke_width'),
                'point_radius' => get_option('point_radius'),
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNull($exhibit->default_vector_color);
        $this->assertNull($exhibit->default_stroke_color);
        $this->assertNull($exhibit->default_highlight_color);
        $this->assertNull($exhibit->default_vector_opacity);
        $this->assertNull($exhibit->default_stroke_opacity);
        $this->assertNull($exhibit->default_stroke_width);
        $this->assertNull($exhibit->default_point_radius);
        $this->assertEquals($exhibit->default_base_layer, 1);

    }



    /**
     * The /resetstyles action should null all style attributes for a record.
     *
     * @return void.
     */
    public function testResetStyles()
    {

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);

        // Set styles.
        $record->vector_color = '#ffffff';
        $record->stroke_color = '#ffffff';
        $record->highlight_color = '#ffffff';
        $record->vector_opacity = 50;
        $record->stroke_opacity = 50;
        $record->stroke_width = 50;
        $record->point_radius = 50;
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'record_id' => $record->id
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/resetstyles');
        $record = $this->_recordsTable->find($record->id);

        // Check.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->highlight_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);

    }

}
