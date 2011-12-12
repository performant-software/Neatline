<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Data record row tests.
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

class Neatline_NeatlineDataRecordTest extends Omeka_Test_AppTestCase
{

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

    }

    /**
     * Test get and set on columns.
     *
     * @return void.
     */
    public function testAttributeAccess()
    {

        // Create a record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set.
        $record->title =                        'title';
        $record->description =                  'description';
        $record->start_date =                   'startdate';
        $record->start_time =                   'starttime';
        $record->end_date =                     'enddate';
        $record->end_time =                     'endtime';
        $record->vector_color =                 '#ffffff';
        $record->geocoverage =                  'POINT()';
        $record->left_ambiguity_percengage =    30;
        $record->right_ambiguity_percengage =   80;
        $record->space_active =                 1;
        $record->time_active =                  1;
        $record->display_order =                1;
        $record->map_bounds =                   'BOUND()';
        $record->map_zoom =                     5;

        // Get.
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->description, 'description');
        $this->assertEquals($record->start_date, 'startdate');
        $this->assertEquals($record->start_time, 'starttime');
        $this->assertEquals($record->end_date, 'enddate');
        $this->assertEquals($record->end_time, 'endtime');
        $this->assertEquals($record->vector_color, '#ffffff');
        $this->assertEquals($record->geocoverage, 'POINT()');
        $this->assertEquals($record->left_ambiguity_percengage, 30);
        $this->assertEquals($record->right_ambiguity_percengage, 80);
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->display_order, 1);
        $this->assertEquals($record->map_bounds, 'BOUND()');
        $this->assertEquals($record->map_zoom, 5);

    }

    /**
     * When a new data record is created, four of the attributes should
     * automatically be set to non-null values. The space and time status
     * trackers should be set to 0/false, and the two date ambiguity
     * settings should be fully expanded - the left should be at 0 and
     * the right at 100.
     *
     * @return void.
     */
    public function testAttributeDefaults()
    {

        // Create a record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->item_id, $item->id);

        // Status columns should be false.
        $this->assertEquals($record->space_active, 0);
        $this->assertEquals($record->time_active, 0);

        // Ambiguity percentages should be 0 and 100.
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);

    }

    /**
     * The time and space status trackers can only take native boolean
     * values as input parameters. The setStatus() method should check
     * to make sure that the input is boolean and set the integer value.
     *
     * @return void.
     */
    public function testSetStatusWithValidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test true.
        $success = $record->setStatus('space', true);
        $this->assertEquals($record->space_active, 1);
        $this->assertTrue($success);

        // Test false.
        $success = $record->setStatus('space', false);
        $this->assertEquals($record->space_active, 0);
        $this->assertTrue($success);

        // Test true.
        $success = $record->setStatus('time', true);
        $this->assertEquals($record->time_active, 1);
        $this->assertTrue($success);

        // Test false.
        $success = $record->setStatus('time', false);
        $this->assertEquals($record->time_active, 0);
        $this->assertTrue($success);

    }

    /**
     * The setStatus() method should reject non-boolean inputs. If a
     * non-boolean value is passed to the method, the record field should
     * be unchanged.
     *
     * @return void.
     */
    public function testSetStatusWithInvalidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test invalid space.
        $failure = $record->setStatus('space', 'notBoolean');
        $this->assertEquals($record->space_active, 0);
        $this->assertFalse($failure);

        // Test invalid time.
        $failure = $record->setStatus('time', 'notBoolean');
        $this->assertEquals($record->time_active, 0);
        $this->assertFalse($failure);

        // Create a record and set values to true.
        $record = $this->helper->_createRecord();
        $record->space_active = 1;
        $record->time_active = 1;

        // Test invalid space reverts to already-set true.
        $failure = $record->setStatus('space', 'notBoolean');
        $this->assertEquals($record->space_active, 1);
        $this->assertFalse($failure);

        // Test invalid time reverts to already-set true.
        $failure = $record->setStatus('time', 'notBoolean');
        $this->assertEquals($record->time_active, 1);
        $this->assertFalse($failure);

    }

    /**
     * The setPercentages() method should set the percentage values when the
     * left does not exceed the right and both values are between 0 and 100.
     *
     * @return void.
     */
    public function testSetPercentagesWithValidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Set int values.
        $success = $record->setPercentages(50, 60);
        $this->assertEquals($record->left_ambiguity_percentage, 50);
        $this->assertEquals($record->right_ambiguity_percentage, 60);
        $this->assertTrue($success);

    }

    /**
     * The setPercentages() method should disallow values when the left does
     * exceeds the right or one of the values is less than 0 greater than 100.
     *
     * @return void.
     */
    public function testSetPercentagesWithInvalidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Try to make the left greater than the right.
        $failure = $record->setPercentages(90, 70);
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);
        $this->assertFalse($failure);

        // Try to make one of the values too small.
        $failure = $record->setPercentages(-10, 90);
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);
        $this->assertFalse($failure);

        // Try to make one of the values too large.
        $failure = $record->setPercentages(10, 110);
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);
        $this->assertFalse($failure);

        // Try to make the values non-integer.
        $failure = $record->setPercentages('notInt', 100);
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);
        $this->assertFalse($failure);

    }

    /**
     * The getTitle() method should return the record title attribute when it
     * is not null; if it is null, try to default in the DC value.
     *
     * @return void.
     */
    public function testGetTitle()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Create title and description element texts.
        $this->helper->_createElementText($item, 'Dublin Core', 'Title', 'Test Title');

        // Should return the DC value.
        $this->assertEquals($record->getTitle(), 'Test Title');

        // Should return the native value.
        $record->title = 'Native Title';
        $this->assertEquals($record->getTitle(), 'Native Title');

    }

    /**
     * The getDescription() method should return the record description attribute when it
     * is not null; if it is null, try to default in the DC value.
     *
     * @return void.
     */
    public function testGetDescription()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Create title and description element texts.
        $this->helper->_createElementText($item, 'Dublin Core', 'Description', 'Test description.');

        // Should return the DC value.
        $this->assertEquals($record->getDescription(), 'Test description.');

        // Should return the native value.
        $record->description = 'Native description.';
        $this->assertEquals($record->getDescription(), 'Native description.');

    }

    /**
     * The getColor() method should return the record vector color attribute when it
     * is not null; if it is null, return the default Neatline purple.
     *
     * @return void.
     */
    public function testGetColor()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Should return Neatline purple.
        $this->assertEquals($record->getColor(), '#724e85');

        // Should return the native value.
        $record->vector_color = '#ffffff';
        $this->assertEquals($record->getColor(), '#ffffff');

    }

    /**
     * The getGeocoverage() method should return the vector data attribute when it
     * is not an empty string; if it is null, return null.
     *
     * @return void.
     */
    public function testGetGeocoverage()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Should return null when the value is null.
        $this->assertNull($record->getGeocoverage());

        // Should return the value when the value is set.
        $record->geocoverage = 'POINT(0,1)';
        $this->assertEquals($record->getGeocoverage(), 'POINT(0,1)');

        // Should return null when the value is an empty string.
        $record->geocoverage = '';
        $this->assertNull($record->getGeocoverage());

    }

}
