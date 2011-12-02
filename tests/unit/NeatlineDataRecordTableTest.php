<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Data record table tests.
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

class Neatline_NeatlineDataRecordTableTest extends Omeka_Test_AppTestCase
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

    }

    /**
     * getRecordByItemAndExhibit() should return boolean false when there is
     * no record for the given exhibit/item combination.
     *
     * @return void.
     */
    public function testGetRecordByItemAndExhibitWithNoRecord()
    {

        // Create item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Try to get a non-existent record.
        $noRecord = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertFalse($noRecord);

    }

    /**
     * getRecordByItemAndExhibit() should return the record when the record exists.
     *
     * @return void.
     */
    public function testGetRecordByItemAndExhibitWithRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Get the record.
        $retrievedRecord = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertEquals($record->id, $retrievedRecord->id);

    }

    /**
     * When saveItemFormData() when there is no existing record for the item /
     * exhibit combination, a new data record should be created and populated.
     *
     * @return void.
     */
    public function testSaveItemFormDataWithNoRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // At the start, no record.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Save form data for a non-existent record.
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

        // After the save, there should be 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Get the new record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Test that the attributes were set.
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
            $record->left_ambiguity_percentage,
            self::$__testParams['left_percent']
        );

        $this->assertEquals(
            $record->right_ambiguity_percentage,
            self::$__testParams['right_percent']
        );

        $this->assertEquals(
            $record->geocoverage,
            self::$__testParams['geocoverage']
        );

        $this->assertEquals(
            $record->space_active,
            (int) self::$__testParams['space_active']
        );

        $this->assertEquals(
            $record->time_active,
            (int) self::$__testParams['time_active']
        );

    }

    /**
     * Test saveItemFormData() when there is a record for the item/exhibit.
     *
     * @return void.
     */
    public function testSaveItemFormDataWithRecord()
    {

        // Create item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Create a record and fill it with valid data.
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // There should be a record.
        $this->assertEquals($this->_recordsTable->count(), 1);

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

        // There should still be just one record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Test that the attributes were set.
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
            $record->left_ambiguity_percentage,
            self::$__testParams['left_percent']
        );

        $this->assertEquals(
            $record->right_ambiguity_percentage,
            self::$__testParams['right_percent']
        );

        $this->assertEquals(
            $record->geocoverage,
            self::$__testParams['geocoverage']
        );

        $this->assertEquals(
            $record->space_active,
            (int) self::$__testParams['space_active']
        );

        $this->assertEquals(
            $record->time_active,
            (int) self::$__testParams['time_active']
        );

    }

    /**
     * saveRecordStatus() should create a new record when there when there
     * is no existing record.
     *
     * @return void.
     */
    public function testSaveRecordStatusWithNoRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // At the start, no records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Save form data for a non-existent record.
        $this->_recordsTable->saveRecordStatus($item, $neatline, 'space', true);

        // After the save, there should be 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Check that the parameter was set.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertEquals($record->space_active, 1);

    }

    /**
     * saveRecordStatus() should update an existing record if one exists.
     *
     * @return void.
     */
    public function testSaveRecordStatusWithRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // At the start, no records.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Save form data for a non-existent record.
        $this->_recordsTable->saveRecordStatus($item, $neatline, 'space', true);

        // After the save, there should be 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Re-get the record.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);

        // Check that the parameter was set.
        $this->assertEquals($record->space_active, 1);

    }

    /**
     * If there is a record for an item, getRecordStatus() should return the
     * space or time active status.
     *
     * @return void.
     */
    public function testGetRecordStatusWithExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Populate statuses with trues.
        $record->space_active = 1;
        $record->time_active = 1;
        $record->save();

        // Get.
        $spaceStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'space');
        $timeStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'time');

        // Check.
        $this->assertTrue($spaceStatus);
        $this->assertTrue($timeStatus);

        // Populate statuses with falses.
        $record->space_active = 0;
        $record->time_active = 0;
        $record->save();

        // Get.
        $spaceStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'space');
        $timeStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'time');

        // Check.
        $this->assertFalse($spaceStatus);
        $this->assertFalse($timeStatus);

    }

    /**
     * If there is not a record for an item, getRecordStatus() should return false.
     *
     * @return void.
     */
    public function testGetRecordStatusWithNoExistingRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Get.
        $spaceStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'space');
        $timeStatus = $this->_recordsTable->getRecordStatus($item, $neatline, 'time');

        // Check.
        $this->assertFalse($spaceStatus);
        $this->assertFalse($timeStatus);

    }

    /**
     * If there is a record for an item, buildEditFormJson() should return a JSON
     * string with the correct attributes.
     *
     * @return void.
     */
    public function testBuildEditFormJsonWithExistingRecord()
    {

        // Create an item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            't',
            'd',
            'sd',
            'st',
            'ed',
            'et',
            'vc',
            40,
            60,
            'g',
            1,
            1
        );

        // Ping the method for the json.
        $json = $this->_recordsTable->buildEditFormJson($item, $neatline);

        // Check for proper construction.
        $this->assertEquals(
            $json,
            '{"title":"t","description":"d","start_date":"sd","start_time":"st","end_date":"ed","end_time":"et","left_percent":40,"right_percent":60,"vector_color":"vc"}'
        );

    }

    /**
     * If there is not a record for an item, buildEditFormJson() should return
     * a well-formed empty object literal with the correct default values.
     *
     * @return void.
     */
    public function testBuildEditFormJsonWithNoExistingRecord()
    {

        // Create an item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Ping the method for the json.
        $json = $this->_recordsTable->buildEditFormJson($item, $neatline);

        // Check for proper construction.
        $this->assertEquals(
            $json,
            '{"title":"","description":"","start_date":"","start_time":"","end_date":"","end_time":"","left_percent":0,"right_percent":100,"vector_color":"#724e85"}'
        );

    }

    /**
     * If is not a record for an item but the item has existing DC metadata,
     * buildEditFormJson() should default in appropriate values for the Title and
     * Description fields.
     *
     * @return void.
     */
    public function testBuildEditFormJsonDefaultDcFields()
    {

        // Create an item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Create title and description element texts.
        $this->helper->_createElementText($item, 'Dublin Core', 'Title', 'Test Title');
        $this->helper->_createElementText($item, 'Dublin Core', 'Description', 'Test Description.');

        // Ping the method for the json.
        $json = $this->_recordsTable->buildEditFormJson($item, $neatline);

        // Check for proper construction.
        $this->assertEquals(
            $json,
            '{"title":"Test Title","description":"Test Description.","start_date":"","start_time":"","end_date":"","end_time":"","left_percent":0,"right_percent":100,"vector_color":"#724e85"}'
        );

    }

    /**
     * If is a record for an item but the record has null values for fields
     * that map to DC elements, the DC elements shouuld be defaulted in regardless.
     *
     * @return void.
     */
    public function testBuildEditFormJsonTitleAndDescriptionOverwrites()
    {

        // Create an item and exhibit.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Commit a status change, leave everything else null.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            1
        );

        // Create title and description element texts.
        $this->helper->_createElementText($item, 'Dublin Core', 'Title', 'Test Title');
        $this->helper->_createElementText($item, 'Dublin Core', 'Description', 'Test Description.');

        // Ping the method for the json.
        $json = $this->_recordsTable->buildEditFormJson($item, $neatline);

        // The title, description, and color fields should still be intelligently
        // populated with possible DC values if there is a null value in the record.
        $this->assertEquals(
            $json,
            '{"title":"Test Title","description":"Test Description.","start_date":"","start_time":"","end_date":"","end_time":"","left_percent":0,"right_percent":100,"vector_color":"#724e85"}'
        );

    }

}
