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
     * Test getRecordByItemAndExhibit() when no record exists.
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
     * Test getRecordByItemAndExhibit() when the record exists.
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

        // Get a non-existent record.
        $retrievedRecord = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertEquals($record->id, $retrievedRecord->id);

    }

    /**
     * Test saveItemFormData() when there is not a record for the
     * item/exhibit.
     *
     * @return void.
     */
    public function testSaveItemFormDataWithNoRecord()
    {

        // Create item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();

        // At the start, no records.
        $this->assertEquals($this->_recordsTable->count(), 0);

        // Save form data for a non-existent record.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
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

        // After the save, there should be 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Get the new record and check the attributes.
        $record = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
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
        $record->save();

        // There should be a record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Save form data with update values.
        $this->_recordsTable->saveItemFormData(
            $item,
            $neatline,
            'New Title',
            'New description.',
            'April 27, 1564',
            '7:00 AM',
            'April 24, 1616',
            '7:00 AM',
            '#000000',
            30,
            70,
            '["POINT(-2.0, 2.0)"]',
            false,
            false
        );

        // There should still be just 1 record.
        $this->assertEquals($this->_recordsTable->count(), 1);

        // Get the new record and check that the attributes were updated.
        $retrievedRecord = $this->_recordsTable->getRecordByItemAndExhibit($item, $neatline);
        $this->assertEquals($retrievedRecord->item_id, $item->id);
        $this->assertEquals($retrievedRecord->exhibit_id, $neatline->id);
        $this->assertEquals($retrievedRecord->title, 'New Title');
        $this->assertEquals($retrievedRecord->description, 'New description.');
        $this->assertEquals($retrievedRecord->start_date, 'April 27, 1564');
        $this->assertEquals($retrievedRecord->start_time, '7:00 AM');
        $this->assertEquals($retrievedRecord->end_date, 'April 24, 1616');
        $this->assertEquals($retrievedRecord->end_time, '7:00 AM');
        $this->assertEquals($retrievedRecord->vector_color, '#000000');
        $this->assertEquals($retrievedRecord->left_ambiguity_percentage, 30);
        $this->assertEquals($retrievedRecord->right_ambiguity_percentage, 70);
        $this->assertEquals($retrievedRecord->geocoverage, '["POINT(-2.0, 2.0)"]');
        $this->assertEquals($retrievedRecord->space_active, 0);
        $this->assertEquals($retrievedRecord->space_active, 0);

    }

}
