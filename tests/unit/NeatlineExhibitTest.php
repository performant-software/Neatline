<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Exhibit row tests.
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

class Neatline_NeatlineExhibitTest extends Omeka_Test_AppTestCase
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
     * The validateForm() method should enforce title existence.
     *
     * @return void.
     */
    public function testValidateForm()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Call with blank title.
        $errors = $neatline->validateForm('');
        $this->assertEquals($errors['title'], 'Enter a title.');

        // Call with title.
        $errors = $neatline->validateForm('Title');
        $this->assertEquals($errors, array());

    }

    /**
     * The saveForm() method should commit the form data.
     *
     * @return void.
     */
    public function testSaveForm()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Save with valid map id and check.
        $success = $neatline->saveForm('Title', 1);
        $this->assertTrue($success);
        $this->assertNotNull($neatline->added);
        $this->assertEquals($neatline->name, 'Title');
        $this->assertEquals($neatline->is_timeline, 1);
        $this->assertEquals($neatline->is_undated_items, 1);
        $this->assertEquals($neatline->is_map, 1);
        $this->assertEquals($neatline->map_id, 1);
        $this->assertEquals($neatline->top_element, 'map');
        $this->assertEquals($neatline->undated_items_position, 'right');
        $this->assertEquals($neatline->undated_items_height, 'full');

        // Save with invalid map id.
        $success = $neatline->saveForm('Title', 'invalid');
        $this->assertEquals($neatline->is_map, 0);
        $this->assertNull($neatline->map_id);

    }

    /**
     * The getMap() method should return an exhibit's map record.
     *
     * @return void.
     */
    public function testGetMap()
    {

        // Create an exhibit and map.
        $neatline = $this->helper->_createNeatline();
        $map = new NeatlineMapsMap();
        $map->save();
        $neatline->saveForm('Title', $map->id);

        // Get the map and check.
        $retrievedMap = $neatline->getMap();
        $this->assertEquals($map->id, $retrievedMap->id);

    }

    /**
     * The saveViewportPositions() method should commit viewport
     * centering data.
     *
     * @return void.
     */
    public function testSaveViewportPositions()
    {

        // Create an exhibit and map.
        $neatline = $this->helper->_createNeatline();

        // Save with int zoom and check.
        $neatline->saveViewportPositions('bounds', 5, 'date');
        $this->assertEquals($neatline->default_map_bounds, 'bounds');
        $this->assertEquals($neatline->default_map_zoom, 5);
        $this->assertEquals($neatline->default_timeline_focus_date, 'date');

        // Save with str zoom and check.
        $neatline->saveViewportPositions('bounds', '5', 'date');
        $this->assertEquals($neatline->default_map_zoom, 5);

    }

    /**
     * The saveViewportArrangement() method should commit viewport
     * arrangement data.
     *
     * @return void.
     */
    public function testSaveViewportArrangement()
    {

        // Create an exhibit and map.
        $neatline = $this->helper->_createNeatline();

        // Save and check.
        $neatline->saveViewportArrangement(1, 1, 1, 'map', 'right', 'full');
        $this->assertEquals($neatline->is_map, 1);
        $this->assertEquals($neatline->is_timeline, 1);
        $this->assertEquals($neatline->is_undated_items, 1);
        $this->assertEquals($neatline->top_element, 'map');
        $this->assertEquals($neatline->undated_items_position, 'right');
        $this->assertEquals($neatline->undated_items_height, 'full');

    }

    /**
     * The getRecordStatus() method should check to see whether a given
     * record is space- or time-active.
     *
     * @return void.
     */
    public function testGetRecordStatus()
    {

        // Create an exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Create a record.
        $record = new NeatlineDataRecord($item, $neatline);

        // Falses.
        $this->assertFalse($neatline->getRecordStatus($item, 'space'));
        $this->assertFalse($neatline->getRecordStatus($item, 'time'));

        // Trues.
        $record->space_active = 1;
        $record->time_active = 1;
        $record->save();
        $this->assertTrue($neatline->getRecordStatus($item, 'space'));
        $this->assertTrue($neatline->getRecordStatus($item, 'time'));

    }

    /**
     * The delete() method should delete the exhibit record and any
     * existing child data records.
     *
     * @return void.
     */
    public function testDelete()
    {

        // Create exhibits and items.
        $neatline1 = $this->helper->_createNeatline();
        $neatline2 = $this->helper->_createNeatline();
        $item1 = $this->helper->_createItem();
        $item2 = $this->helper->_createItem();

        // Create records.
        $record1 = new NeatlineDataRecord($item1, $neatline1);
        $record2 = new NeatlineDataRecord($item2, $neatline1);
        $record3 = new NeatlineDataRecord($item1, $neatline2);
        $record4 = new NeatlineDataRecord($item2, $neatline2);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // 2 exhibits, 4 data records.
        $_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $_recordsTable = $this->db->getTable('NeatlineDataRecord');
        $this->assertEquals($_exhibitsTable->count(), 2);
        $this->assertEquals($_recordsTable->count(), 4);

        // Call delete.
        $neatline1->delete();

        // 1 exhibits, 2 data records.
        $this->assertEquals($_exhibitsTable->count(), 1);
        $this->assertEquals($_recordsTable->count(), 2);



    }

}
