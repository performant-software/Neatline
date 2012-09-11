<?php
/**
 * Editor controller integration tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorControllerTest extends Neatline_Test_AppTestCase
{

    protected $_isAdminTest = true;

    // Testing parameters.
    private static $__testParams = array(
        'title' => 'Test Title',
        'slug' => 'test-slug',
        'description' => 'Test description.',
        'start_date' => '1564-04-26 14:39:22',
        'end_date' => '1616-04-23 12:45:34',
        'start_visible_date' => '1864-04-26 14:39:22',
        'end_visible_date' => '1916-04-23 12:45:34',
        'vector_color' => '#ffffff',
        'stroke_color' => '#f0f0f0',
        'highlight_color' => '#000000',
        'vector_opacity' => 60,
        'select_opacity' => 50,
        'stroke_opacity' => 40,
        'graphic_opacity' => 90,
        'stroke_width' => 5,
        'point_radius' => 7,
        'point_image' => 'http://test.org',
        'left_percent' => 0,
        'right_percent' => 100,
        'geocoverage' => '[POINT(-1.0, 1.0)]',
        'space_active' => true,
        'time_active' => true,
        'parent_record_id' => 1,
        'use_dc_metadata' => 1,
        'show_bubble' => 1
    );

    /**
     * When there is no saved query, /items should return no Omeka items.
     *
     * @return void.
     */
    public function testItemsWithNullQuery()
    {

        // Create item, exhibit, and records.
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();
        $record2 = new NeatlineDataRecord($item, $neatline);
        $record2->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'exhibit_id' => $neatline->id
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryContentContains('tr.header-row.hidden td', 'Omeka Records');
        $this->assertQueryCount('tr.item-row', 1);

    }

    /**
     * When there is a saved empty query, /items should return no Omeka items.
     *
     * @return void.
     */
    public function testItemsWithEmptyQuery()
    {

        // Create item, exhibit, and records.
        $item = $this->_createItem();
        $exhibit = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->save();
        $record2 = new NeatlineDataRecord($item, $exhibit);
        $record2->save();

        // Save empty query.
        $exhibit->query = serialize(array(
            'search' => '',
            'advanced' => array(
                array(
                    'element_id' => '',
                    'type' => '',
                    'terms' => ''
                )
            ),
            'range' => '',
            'collection' => '',
            'type' => '',
            'user' => '',
            'tags' => '',
            'public' => '',
            'featured' => ''
        ));

        // Commit.
        $exhibit->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'exhibit_id' => $exhibit->id
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryContentContains('tr.header-row.hidden td', 'Omeka Records');
        $this->assertQueryCount('tr.item-row', 1);

    }

    /**
     * When Omeka records exist but Neatline-endemic records do not exist, /items
     * should return the Omeka items without the Neatline Records heading.
     *
     * @return void.
     */
    public function testItemsWithOmekaRecords()
    {

        // Create item, exhibit, and records.
        $item = $this->_createItem();
        $exhibit = $this->_createNeatline();
        $record = new NeatlineDataRecord($item, $exhibit);
        $record->save();

        // Save empty query.
        $exhibit->query = serialize(array(
            'search' => '',
            'advanced' => array(
                array(
                    'element_id' => '',
                    'type' => '',
                    'terms' => ''
                )
            ),
            'range' => $item->id,
            'collection' => '',
            'type' => '',
            'user' => '',
            'tags' => '',
            'public' => '',
            'featured' => ''
        ));

        // Commit.
        $exhibit->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'exhibit_id' => $exhibit->id
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row.hidden td', 'Neatline Records');
        $this->assertQueryContentContains('tr.header-row td', 'Omeka Records');
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

        // Create item, exhibit, and records.
        $item = $this->_createItem();
        $exhibit = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->save();
        $record2 = new NeatlineDataRecord($item, $exhibit);
        $record2->save();

        // Save empty query.
        $exhibit->query = serialize(array(
            'search' => '',
            'advanced' => array(
                array(
                    'element_id' => '',
                    'type' => '',
                    'terms' => ''
                )
            ),
            'range' => $item->id,
            'collection' => '',
            'type' => '',
            'user' => '',
            'tags' => '',
            'public' => '',
            'featured' => ''
        ));

        // Commit.
        $exhibit->save();

        // Prepare the request.
        $this->request->setMethod('GET')
            ->setParams(array(
                'exhibit_id' => $exhibit->id
            )
        );

        // Hit the route, check the markup.
        $this->dispatch('neatline-exhibits/editor/ajax/items');
        $this->assertQueryContentContains('tr.header-row td', 'Neatline Records');
        $this->assertQueryContentContains('tr.header-row td', 'Omeka Records');
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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
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
        $response = $this->getResponse()->getBody('default');

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 0);

        // Action should return the record id.
        $this->assertContains(
            '"record_id":' . $record->id . '',
            $response
        );

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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
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
        $response = $this->getResponse()->getBody('default');

        // Should not create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Time status should be true, space status unchanged.
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->space_active, 0);

        // Action should return the record id.
        $this->assertContains(
            '"record_id":' . $record->id . '',
            $response
        );

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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();

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
        $response = $this->getResponse()->getBody('default');

        // Should create a new record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Space status should be true, time status unchanged.
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 0);

        // Action should return the record id.
        $this->assertContains(
            '"record_id":' . $record->id . '',
            $response
        );

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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();

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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
        $parent = $this->_createRecord();
        $record = new NeatlineDataRecord($item, $neatline);

        // Populate fields.
        $record->title =                self::$__testParams['title'];
        $record->slug =                 self::$__testParams['slug'];
        $record->description =          self::$__testParams['description'];
        $record->parent_record_id =     $parent->id;
        $record->show_bubble =          self::$__testParams['show_bubble'];
        $record->start_date =           self::$__testParams['start_date'];
        $record->end_date =             self::$__testParams['end_date'];
        $record->start_visible_date =   self::$__testParams['start_visible_date'];
        $record->end_visible_date =     self::$__testParams['end_visible_date'];
        $record->vector_color =         self::$__testParams['vector_color'];
        $record->stroke_color =         self::$__testParams['stroke_color'];
        $record->highlight_color =      self::$__testParams['highlight_color'];
        $record->vector_opacity =       self::$__testParams['vector_opacity'];
        $record->select_opacity =       self::$__testParams['select_opacity'];
        $record->stroke_opacity =       self::$__testParams['stroke_opacity'];
        $record->graphic_opacity =      self::$__testParams['graphic_opacity'];
        $record->stroke_width =         self::$__testParams['stroke_width'];
        $record->point_radius =         self::$__testParams['point_radius'];
        $record->point_image =          self::$__testParams['point_image'];
        $record->left_percent =         self::$__testParams['left_percent'];
        $record->right_percent =        self::$__testParams['right_percent'];
        $record->geocoverage =          self::$__testParams['geocoverage'];
        $record->space_active =         self::$__testParams['space_active'];
        $record->time_active =          self::$__testParams['time_active'];
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

        // Ping the method for the json.
        $json = json_decode($response);

        $this->assertEquals(
            $json,
            (object) array(
                'title' =>              self::$__testParams['title'],
                'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'parent_record_id' =>   $parent->id,
                'use_dc_metadata' =>    null,
                'show_bubble' =>        self::$__testParams['show_bubble'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'records' => array()
            )
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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
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

        // Ping the method for the json.
        $json = json_decode($response);

        $this->assertEquals(
            $json,
            (object) array(
                'title' =>              '',
                'description' =>        '',
                'vector_color' =>       get_plugin_ini('Neatline', 'vector_color'),
                'stroke_color' =>       get_plugin_ini('Neatline', 'stroke_color'),
                'highlight_color' =>    get_plugin_ini('Neatline', 'highlight_color'),
                'vector_opacity' =>     (int) get_plugin_ini('Neatline', 'vector_opacity'),
                'select_opacity' =>     (int) get_plugin_ini('Neatline', 'select_opacity'),
                'stroke_opacity' =>     (int) get_plugin_ini('Neatline', 'stroke_opacity'),
                'graphic_opacity' =>    (int) get_plugin_ini('Neatline', 'graphic_opacity'),
                'stroke_width' =>       (int) get_plugin_ini('Neatline', 'stroke_width'), 
                'point_radius' =>       (int) get_plugin_ini('Neatline', 'point_radius'), 
                'point_image' =>        '',
                'left_percent' =>       0,
                'right_percent' =>      100,
                'start_date' =>         '',
                'end_date' =>           '',
                'start_visible_date' => '',
                'end_visible_date' =>   '',
                'slug' =>               '',
                'parent_record_id' =>   'none',
                'use_dc_metadata' =>    null,
                'show_bubble' =>        1,
                'geocoverage' =>        '',
                'records' =>            array()
            )
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
        $item = $this->_createItem();
        $neatline = $this->_createNeatline();

        // Create element texts.
        $this->_createElementText(
            $item,
            'Dublin Core',
            'Title',
            'Test Title');

        $this->_createElementText(
            $item,
            'Dublin Core',
            'Description',
            'Test description.');

        // Form the POST for a space change.
        $this->request->setMethod('GET')
            ->setParams(array(
                'item_id' => $item->id,
                'exhibit_id' => $neatline->id,
                'record_id' => 'null'
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/form');
        $response = $this->getResponse()->getBody('default');

        // Ping the method for the json.
        $json = json_decode($response);

        $this->assertEquals(
            $json,
            (object) array(
                'vector_color' => get_plugin_ini('Neatline', 'vector_color'),
                'stroke_color' => get_plugin_ini('Neatline', 'stroke_color'),
                'highlight_color' => get_plugin_ini('Neatline', 'highlight_color'),
                'vector_opacity' => get_plugin_ini('Neatline', 'vector_opacity'),
                'select_opacity' => get_plugin_ini('Neatline', 'select_opacity'),
                'stroke_opacity' => get_plugin_ini('Neatline', 'stroke_opacity'),
                'graphic_opacity' => get_plugin_ini('Neatline', 'graphic_opacity'),
                'stroke_width' => get_plugin_ini('Neatline', 'stroke_width'),
                'point_radius' => get_plugin_ini('Neatline', 'point_radius'),
                'point_image' => '',
                'left_percent' => 0,
                'right_percent' => 100,
                'start_date' =>'',
                'end_date' => '',
                'start_visible_date' => '',
                'end_visible_date' => '',
                'slug' => '',
                'parent_record_id' => 'none',
                'use_dc_metadata' => 0,
                'show_bubble' => 1,
                'records' => array(),
                'title' => 'Test Title',
                'description' => 'Test description.'
            )
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

        // Create exhibit and records.
        $neatline = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();

        $record2 = new NeatlineDataRecord(null, $neatline);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            '',
                'record_id' =>          $record2->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    0
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Test the raw construction with no available DC values.
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":' . $record2->id, $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find($record2->id);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        // $this->assertEquals(
        //     $record->slug,
        //     self::$__testParams['slug']
        // );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->start_visible_date,
            self::$__testParams['start_visible_date']
        );

        $this->assertEquals(
            $record->end_visible_date,
            self::$__testParams['end_visible_date']
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
            $record->select_opacity,
            self::$__testParams['select_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->graphic_opacity,
            self::$__testParams['graphic_opacity']
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
            $record->point_image,
            self::$__testParams['point_image']
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
            $record->parent_record_id,
            self::$__testParams['parent_record_id']
        );

        $this->assertNull($record->use_dc_metadata);

        $this->assertEquals(
            $record->show_bubble,
            0
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();

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
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   $record1->id,
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
            )
        );

        // 1 records.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 2 record.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Test the raw construction with no available DC values.
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":2', $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        // $this->assertEquals(
        //     $record->slug,
        //     self::$__testParams['slug']
        // );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->start_visible_date,
            self::$__testParams['start_visible_date']
        );

        $this->assertEquals(
            $record->end_visible_date,
            self::$__testParams['end_visible_date']
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
            $record->select_opacity,
            self::$__testParams['select_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->graphic_opacity,
            self::$__testParams['graphic_opacity']
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
            $record->point_image,
            self::$__testParams['point_image']
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
            $record->parent_record_id,
            $record1->id
        );

        $this->assertEquals(
            $record->use_dc_metadata,
            1
        );

        $this->assertEquals(
            $record->show_bubble,
            0
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

        // Create exhibit and records.
        $neatline = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();

        $item = $this->_createItem();
        $record2 = new NeatlineDataRecord($item, $neatline);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          $record2->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
            )
        );

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');
        $response = $this->getResponse()->getBody('default');

        // 1 record.
        $this->assertEquals($this->_recordsTable->count(), 2);

        // Test the raw construction with 
        $this->assertContains('"statuses":', $response);
        $this->assertContains('"space":true', $response);
        $this->assertContains('"time":true', $response);
        $this->assertContains('"recordid":' . $record2->id, $response);

        // Get the record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        $this->assertEquals(
            $record->title,
            self::$__testParams['title']
        );

        // $this->assertEquals(
        //     $record->slug,
        //     self::$__testParams['slug']
        // );

        $this->assertEquals(
            $record->description,
            self::$__testParams['description']
        );

        $this->assertEquals(
            $record->start_date,
            self::$__testParams['start_date']
        );

        $this->assertEquals(
            $record->end_date,
            self::$__testParams['end_date']
        );

        $this->assertEquals(
            $record->start_visible_date,
            self::$__testParams['start_visible_date']
        );

        $this->assertEquals(
            $record->end_visible_date,
            self::$__testParams['end_visible_date']
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
            $record->select_opacity,
            self::$__testParams['select_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->graphic_opacity,
            self::$__testParams['graphic_opacity']
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
            $record->point_image,
            self::$__testParams['point_image']
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
            $record->parent_record_id,
            self::$__testParams['parent_record_id']
        );

        $this->assertEquals(
            $record->use_dc_metadata,
            1
        );

        $this->assertEquals(
            $record->show_bubble,
            0
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
     * When an unchanged parent_record_id is posted to /save, all styling and
     * visibility information should be saved.
     *
     * @return void.
     */
    public function testSaveWithUnchangedParentRecordId()
    {

        // Create exhibit and records.
        $neatline = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();

        $item = $this->_createItem();
        $record2 = new NeatlineDataRecord($item, $neatline);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            '',
                'record_id' =>          $record2->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        'null',
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   $record1->id,
                'show_bubble' =>        0,
                'use_dc_metadata' =>    0
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find($record2->id);

        $this->assertEquals(
            $record->start_visible_date,
            self::$__testParams['start_visible_date']
        );

        $this->assertEquals(
            $record->end_visible_date,
            self::$__testParams['end_visible_date']
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
            $record->select_opacity,
            self::$__testParams['select_opacity']
        );

        $this->assertEquals(
            $record->stroke_opacity,
            self::$__testParams['stroke_opacity']
        );

        $this->assertEquals(
            $record->graphic_opacity,
            self::$__testParams['graphic_opacity']
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
            $record->point_image,
            self::$__testParams['point_image']
        );

    }

    /**
     * When an changed parent_record_id is posted to /save, all styling and
     * visibility information should not be saved.
     *
     * @return void.
     */
    public function testSaveWithChangedParentRecordId()
    {

        // Create exhibit and records.
        $neatline = $this->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->save();

        $item = $this->_createItem();
        $record2 = new NeatlineDataRecord($item, $neatline);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        $record3 = new NeatlineDataRecord(null, $neatline);
        $record3->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            '',
                'record_id' =>          $record2->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        'null',
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   $record3->id,
                'show_bubble' =>        0,
                'use_dc_metadata' =>    0
            )
        );

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/editor/ajax/save');

        // Get the record and check the attributes.
        $record = $this->_recordsTable->find($record2->id);
        $this->assertNull($record->start_visible_date);
        $this->assertNull($record->end_visible_date);
        $this->assertNull($record->vector_color);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->highlight_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->select_opacity);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->graphic_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);

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
        $neatline = $this->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);
        $record->geocoverage = 'POINT(1,0)';
        $record->save();

        // Form the POST for a space change.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            '',
                'record_id' =>          $record->id,
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        'null',
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    0
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();
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
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['highlight_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();
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
                'time_active' =>        'false',
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         '',
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       (string) self::$__testParams['space_active'],
                'time_active' =>        'false',
                'geocoverage' =>        self::$__testParams['geocoverage'],
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         '',
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();
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
                'space_active' =>       'false',
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        '',
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();

        // Form the POST with new geocoverage data.
        $this->request->setMethod('POST')
            ->setPost(array(
                'item_id' =>            $item->id,
                'record_id' =>          '',
                'exhibit_id' =>         $neatline->id,
                'space_active' =>       'false',
                'time_active' =>        (string) self::$__testParams['time_active'],
                'geocoverage' =>        '',
                'title' =>              self::$__testParams['title'],
                // 'slug' =>               self::$__testParams['slug'],
                'description' =>        self::$__testParams['description'],
                'start_date' =>         self::$__testParams['start_date'],
                'end_date' =>           self::$__testParams['end_date'],
                'start_visible_date' => self::$__testParams['start_visible_date'],
                'end_visible_date' =>   self::$__testParams['end_visible_date'],
                'left_percent' =>       self::$__testParams['left_percent'],
                'right_percent' =>      self::$__testParams['right_percent'],
                'vector_color' =>       self::$__testParams['vector_color'],
                'stroke_color' =>       self::$__testParams['stroke_color'],
                'highlight_color' =>    self::$__testParams['stroke_color'],
                'vector_opacity' =>     self::$__testParams['vector_opacity'],
                'select_opacity' =>     self::$__testParams['select_opacity'],
                'stroke_opacity' =>     self::$__testParams['stroke_opacity'],
                'graphic_opacity' =>    self::$__testParams['graphic_opacity'],
                'stroke_width' =>       self::$__testParams['stroke_width'],
                'point_radius' =>       self::$__testParams['point_radius'],
                'point_image' =>        self::$__testParams['point_image'],
                'parent_record_id' =>   self::$__testParams['parent_record_id'],
                'show_bubble' =>        0,
                'use_dc_metadata' =>    1
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
        $neatline = $this->_createNeatline();
        $item1 = $this->_createItem();
        $item2 = $this->_createItem();
        $item3 = $this->_createItem();
        $item4 = $this->_createItem();
        $item5 = $this->_createItem();
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);
        $record3 = new NeatlineDataRecord($item3, $neatline);
        $record4 = new NeatlineDataRecord($item4, $neatline);
        $record5 = new NeatlineDataRecord($item5, $neatline);
        $record1->items_active = 1;
        $record2->items_active = 1;
        $record3->items_active = 1;
        $record4->items_active = 1;
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
        $exhibit->title =                       'Test Title';
        $exhibit->slug =                        'test-slug';
        $exhibit->public =                      1;
        $exhibit->is_map =                      0;
        $exhibit->is_timeline =                 0;
        $exhibit->is_items =                    0;
        $exhibit->is_context_band =             0;
        $exhibit->top_element =                 'timeline';
        $exhibit->items_h_pos =                 'left';
        $exhibit->items_v_pos =                 'top';
        $exhibit->items_height =                'partial';
        $exhibit->h_percent =                   50;
        $exhibit->v_percent =                   50;
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
        $this->assertContains('"title":"Test Title"', $response);
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
        $this->assertContains('"map_bounds":null', $response);
        $this->assertContains('"map_zoom":null', $response);
        $this->assertContains('"focus_date":null', $response);
        $this->assertContains('"vector_color":null', $response);
        $this->assertContains('"vector_opacity":null', $response);
        $this->assertContains('"stroke_color":null', $response);
        $this->assertContains('"stroke_opacity":null', $response);
        $this->assertContains('"stroke_width":null', $response);
        $this->assertContains('"point_radius":null', $response);
        $this->assertContains('"point_radius":null', $response);
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
        $exhibit->title =                       'Test Title';
        $exhibit->slug =                        'test-slug';
        $exhibit->public =                      1;
        $exhibit->is_map =                      0;
        $exhibit->is_timeline =                 0;
        $exhibit->is_items =                    0;
        $exhibit->is_context_band =             0;
        $exhibit->top_element =                 'timeline';
        $exhibit->items_h_pos =                 'left';
        $exhibit->items_v_pos =                 'top';
        $exhibit->items_height =                'partial';
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
        $this->assertContains('"title":"Test Title"', $response);
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
        $this->assertContains('"map_bounds":null', $response);
        $this->assertContains('"map_zoom":null', $response);
        $this->assertContains('"focus_date":null', $response);
        $this->assertContains('"vector_color":null', $response);
        $this->assertContains('"vector_opacity":null', $response);
        $this->assertContains('"stroke_color":null', $response);
        $this->assertContains('"stroke_opacity":null', $response);
        $this->assertContains('"stroke_width":null', $response);
        $this->assertContains('"point_radius":null', $response);
        $this->assertContains('"point_radius":null', $response);
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
        $exhibit = $this->_createNeatline();

        // Create a base layer.
        $layer = new NeatlineBaseLayer();
        $layer->name = 'Test Layer';
        $layer->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'map_center' => 'center',
                'map_zoom' => 1,
                'map_base_layer' => 'Test Layer',
                'timeline_center' => 'center',
                'timeline_zoom' => 10
            )
        );

        // Hit the positions save route, reget the exhibit.
        $this->dispatch('neatline-exhibits/editor/ajax/positions');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check the attributes.
        $this->assertEquals($exhibit->map_bounds, 'center');
        $this->assertEquals($exhibit->map_zoom, 1);
        $this->assertEquals($exhibit->base_layer, $layer->id);
        $this->assertEquals($exhibit->focus_date, 'center');
        $this->assertEquals($exhibit->timeline_zoom, 10);

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
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => $record->id,
                'center' => 'CENTER()',
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
        $this->assertEquals($record->map_bounds, 'CENTER()');
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
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => '',
                'center' => 'CENTER()',
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
        $this->assertEquals($record->map_bounds, 'CENTER()');
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
        $exhibit = $this->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => '',
                'record_id' => $record->id,
                'center' => 'CENTER()',
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
        $this->assertEquals($record->map_bounds, 'CENTER()');
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
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => '',
                'center' => 'CENTER()',
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
        $this->assertEquals($record->map_bounds, 'CENTER()');
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
        $neatline = $this->_createNeatline();
        $item = $this->_createItem();

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
        $neatline = $this->_createNeatline();
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
        $exhibit = $this->_createNeatline();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('highlight_color', '#000000');
        set_option('vector_opacity', 20);
        set_option('select_opacity', 40);
        set_option('stroke_opacity', 70);
        set_option('graphic_opacity', 90);
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
                'select_opacity' => 5,
                'stroke_opacity' => 5,
                'graphic_opacity' => 5,
                'stroke_width' => 5,
                'point_radius' => 5,
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNotNull($exhibit->vector_color);
        $this->assertEquals($exhibit->vector_color, '#ffffff');
        $this->assertNotNull($exhibit->stroke_color);
        $this->assertEquals($exhibit->stroke_color, '#ffffff');
        $this->assertNotNull($exhibit->highlight_color);
        $this->assertEquals($exhibit->highlight_color, '#ffffff');
        $this->assertNotNull($exhibit->vector_opacity);
        $this->assertEquals($exhibit->vector_opacity, 5);
        $this->assertNotNull($exhibit->select_opacity);
        $this->assertEquals($exhibit->select_opacity, 5);
        $this->assertNotNull($exhibit->stroke_opacity);
        $this->assertEquals($exhibit->stroke_opacity, 5);
        $this->assertNotNull($exhibit->graphic_opacity);
        $this->assertEquals($exhibit->graphic_opacity, 5);
        $this->assertNotNull($exhibit->stroke_width);
        $this->assertEquals($exhibit->stroke_width, 5);
        $this->assertNotNull($exhibit->point_radius);
        $this->assertEquals($exhibit->point_radius, 5);
        $this->assertEquals($exhibit->base_layer, 1);

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
        $exhibit = $this->_createNeatline();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'vector_color' => get_plugin_ini('Neatline', 'vector_color'),
                'vector_opacity' => get_plugin_ini('Neatline', 'vector_opacity'),
                'select_opacity' => get_plugin_ini('Neatline', 'select_opacity'),
                'stroke_color' => get_plugin_ini('Neatline', 'stroke_color'),
                'highlight_color' => get_plugin_ini('Neatline', 'highlight_color'),
                'stroke_opacity' => get_plugin_ini('Neatline', 'stroke_opacity'),
                'graphic_opacity' => get_plugin_ini('Neatline', 'graphic_opacity'),
                'stroke_width' => get_plugin_ini('Neatline', 'stroke_width'),
                'point_radius' => get_plugin_ini('Neatline', 'point_radius'),
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNull($exhibit->vector_color);
        $this->assertNull($exhibit->stroke_color);
        $this->assertNull($exhibit->highlight_color);
        $this->assertNull($exhibit->vector_opacity);
        $this->assertNull($exhibit->select_opacity);
        $this->assertNull($exhibit->stroke_opacity);
        $this->assertNull($exhibit->graphic_opacity);
        $this->assertNull($exhibit->stroke_width);
        $this->assertNull($exhibit->point_radius);
        $this->assertEquals($exhibit->base_layer, 1);

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
        $exhibit = $this->_createNeatline();
        $exhibit->vector_color = '#000000';
        $exhibit->stroke_color = '#000000';
        $exhibit->vector_opacity = 1;
        $exhibit->select_opacity = 1;
        $exhibit->stroke_opacity = 1;
        $exhibit->graphic_opacity = 1;
        $exhibit->stroke_width = 1;
        $exhibit->point_radius = 1;
        $exhibit->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'vector_color' => get_plugin_ini('Neatline', 'vector_color'),
                'stroke_color' => get_plugin_ini('Neatline', 'stroke_color'),
                'highlight_color' => get_plugin_ini('Neatline', 'highlight_color'),
                'vector_opacity' => get_plugin_ini('Neatline', 'vector_opacity'),
                'select_opacity' => get_plugin_ini('Neatline', 'select_opacity'),
                'stroke_opacity' => get_plugin_ini('Neatline', 'stroke_opacity'),
                'graphic_opacity' => get_plugin_ini('Neatline', 'graphic_opacity'),
                'stroke_width' => get_plugin_ini('Neatline', 'stroke_width'),
                'point_radius' => get_plugin_ini('Neatline', 'point_radius'),
                'base_layer' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/mapsettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNull($exhibit->vector_color);
        $this->assertNull($exhibit->stroke_color);
        $this->assertNull($exhibit->highlight_color);
        $this->assertNull($exhibit->vector_opacity);
        $this->assertNull($exhibit->select_opacity);
        $this->assertNull($exhibit->stroke_opacity);
        $this->assertNull($exhibit->graphic_opacity);
        $this->assertNull($exhibit->stroke_width);
        $this->assertNull($exhibit->point_radius);
        $this->assertEquals($exhibit->base_layer, 1);

    }

    /**
     * The /timelinesettings route should commit row-level style defaults on
     * the exhibit record when they do not match the system defaults.
     *
     * @return void.
     */
    public function testTimelineSettingsWithNovelValues()
    {

        // Create an exhibit, set is_context_band.
        $exhibit = $this->_createNeatline();
        $exhibit->is_context_band = 0;

        // Set system styling defaults.
        set_option('context_band_unit', 'decade');
        set_option('context_band_height', '35');

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'is_context_band' => '1',
                'context_band_unit' => 'month',
                'context_band_height' => '45'
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/timelinesettings');
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check.
        $this->assertNotNull($exhibit->is_context_band);
        $this->assertEquals($exhibit->is_context_band, 1);
        $this->assertNotNull($exhibit->context_band_unit);
        $this->assertEquals($exhibit->context_band_unit, 'month');
        $this->assertNotNull($exhibit->context_band_height);
        $this->assertEquals($exhibit->context_band_height, 45);

    }

    /**
     * The /resetstyles action should null all style attributes for a record.
     *
     * @return void.
     */
    public function testResetStyles()
    {

        // Create an exhibit.
        $exhibit = $this->_createNeatline();
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

    /**
     * The /dcdefault action should set the use_dc_default field when
     * there is an existing record id.
     *
     * @return void.
     */
    public function testDcDefaultOnWithExistingRecordId()
    {

        // Create an exhibit, item, and record.
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);

        // Set description and use_dc_metadata.
        $record->use_dc_metadata = 0;
        $record->description = 'Description.';
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => $record->id,
                'status' => 1
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/dcdefault');
        $record = $this->_recordsTable->find($record->id);

        // Capture the response as a HTML document.
        $response = $this->getResponse()->getBody('default');
        $doc = new DomDocument;
        $doc->loadHTML($response);

        // Check that the status was changed and that the method
        // returns the DC show for the item.
        $this->assertEquals($record->use_dc_metadata, 1);
        $this->assertSelectCount('div.element-set', true, $doc);

    }

    /**
     * The /dcdefault action should set the use_dc_default field when
     * there is an existing record id and return the row-level description.
     *
     * @return void.
     */
    public function testDcDefaultOffWithExistingRecordId()
    {

        // Create an exhibit, item, and record.
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();
        $record = new NeatlineDataRecord($item, $exhibit);

        // Set description and use_dc_metadata.
        $record->use_dc_metadata = 1;
        $record->description = 'Description.';
        $record->save();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => $record->id,
                'status' => 0
            )
        );

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/dcdefault');
        $record = $this->_recordsTable->find($record->id);

        // Capture the response as a HTML document.
        $response = $this->getResponse()->getBody('default');
        $this->assertEquals($record->use_dc_metadata, 0);
        $this->assertEquals($response, 'Description.');

    }

    /**
     * The /dcdefault action should create a new data record and set
     * the use_dc_default field when there is not an existing record id.
     *
     * @return void.
     */
    public function testDcDefaultOnWithoutExistingRecordId()
    {

        // Create an exhibit, item, and record.
        $exhibit = $this->_createNeatline();
        $item = $this->_createItem();

        // Form the POST.
        $this->request->setMethod('POST')
            ->setPost(array(
                'exhibit_id' => $exhibit->id,
                'item_id' => $item->id,
                'record_id' => 'null',
                'status' => 1
            )
        );

        // Capture starting count.
        $count = $this->_recordsTable->count();

        // Hit the route, re-get the record.
        $this->dispatch('neatline-exhibits/editor/ajax/dcdefault');

        // +1 records.
        $this->assertEquals($this->_recordsTable->count(), $count+1);

        // Capture the response as a HTML document.
        $response = $this->getResponse()->getBody('default');
        $doc = new DomDocument;
        $doc->loadHTML($response);

        // Check that the status was changed and that the method
        // returns the DC show for the item.
        $record = $this->_recordsTable->find(1);
        $this->assertEquals($record->use_dc_metadata, 1);
        $this->assertSelectCount('div.element-set', true, $doc);

    }

}
