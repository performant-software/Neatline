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

}
