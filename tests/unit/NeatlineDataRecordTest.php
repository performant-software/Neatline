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
     * @param string $spaceOrTime 'space' or 'time'.
     * @param boolean $value The new value.
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
     * Test column defaults.
     *
     * @return void.
     */
    public function testAttributeDefaults()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Status columns should be false.
        $this->assertEquals($record->space_active, 0);
        $this->assertEquals($record->time_active, 0);

        // Ambiguity percentages should be 0 and 100.
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);

    }

    /**
     * Test setStatus() with valid inputs.
     *
     * @return void.
     */
    public function testSetStatusWithValidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test true.
        $record->setStatus('space', true);
        $this->assertEquals($record->space_active, 1);

        // Test false.
        $record->setStatus('space', false);
        $this->assertEquals($record->space_active, 0);

        // Test true.
        $record->setStatus('time', true);
        $this->assertEquals($record->time_active, 1);

        // Test false.
        $record->setStatus('time', false);
        $this->assertEquals($record->time_active, 0);

    }

    /**
     * Test setStatus() with invalid inputs.
     *
     * @return void.
     */
    public function testSetStatusWithInvalidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test invalid space.
        $record->setStatus('space', 'notBoolean');
        $this->assertEquals($record->space_active, 0);

        // Test invalid time.
        $record->setStatus('time', 'notBoolean');
        $this->assertEquals($record->time_active, 0);

        // Create a record and set values to true.
        $record = $this->helper->_createRecord();
        $record->space_active = 1;
        $record->time_active = 1;

        // Test invalid space reverts to already-set true.
        $record->setStatus('space', 'notBoolean');
        $this->assertEquals($record->space_active, 1);

        // Test invalid time reverts to already-set true.
        $record->setStatus('time', 'notBoolean');
        $this->assertEquals($record->time_active, 1);

    }

    /**
     * Test populateRecord().
     *
     * @return void.
     */
    public function testPopulateRecord()
    {

        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // Create a record and fill it with valid data.
        $record = new NeatlineDataRecord($item, $neatline);
        $record->populateRecord(
            'Test Title',
            'Test description.',
            'April 26, 1564',
            '6:00 AM',
            'April 23, 1616',
            '6:00 AM',
            '#ffffff',
            0,
            100,
            '["POINT(-1.0, 1.0)"]',
            true,
            true
        );

        // Test that the attributes were set.
        $this->assertEquals($record->item_id, $item->id);
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->title, 'Test Title');
        $this->assertEquals($record->description, 'Test description.');
        $this->assertEquals($record->start_date, 'April 26, 1564');
        $this->assertEquals($record->start_time, '6:00 AM');
        $this->assertEquals($record->end_date, 'April 23, 1616');
        $this->assertEquals($record->end_time, '6:00 AM');
        $this->assertEquals($record->vector_color, '#ffffff');
        $this->assertEquals($record->left_ambiguity_percentage, 0);
        $this->assertEquals($record->right_ambiguity_percentage, 100);
        $this->assertEquals($record->geocoverage, '["POINT(-1.0, 1.0)"]');
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->space_active, 1);

    }

}
