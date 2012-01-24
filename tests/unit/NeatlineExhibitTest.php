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
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');

    }

    /**
     * Test get and set on columns.
     *
     * @return void.
     */
    public function testAttributeAccess()
    {

        // Create a record, capture time.
        $exhibit = new NeatlineExhibit();
        $timestamp = neatline_getTimestamp();

        // Set.
        $exhibit->name =                        'name';
        $exhibit->modified =                    $timestamp;
        $exhibit->map_id =                      1;
        $exhibit->top_element =                 'map';
        $exhibit->items_h_pos =                 'right';
        $exhibit->items_v_pos =                 'top';
        $exhibit->items_height =                'full';
        $exhibit->is_map =                      1;
        $exhibit->is_timeline =                 1;
        $exhibit->is_items =                    1;
        $exhibit->h_percent =                   50;
        $exhibit->v_percent =                   50;
        $exhibit->default_map_bounds =          'BOUND()';
        $exhibit->default_map_zoom =            1;
        $exhibit->default_focus_date =          'date';
        $exhibit->default_vector_color =        '#ffffff';
        $exhibit->default_vector_opacity =      50;
        $exhibit->default_stroke_opacity =      50;
        $exhibit->default_stroke_color =        '#ffffff';
        $exhibit->default_stroke_width =        3;
        $exhibit->default_point_radius =        3;
        $exhibit->default_base_layer =          1;
        $exhibit->save();

        // Re-get the exhibit object.
        $exhibit = $this->_exhibitsTable->find(1);

        // Get.
        $this->assertNotNull($exhibit->added);
        $this->assertNotNull($exhibit->modified);
        $this->assertEquals($exhibit->modified, $timestamp);
        $this->assertEquals($exhibit->name, 'name');
        $this->assertEquals($exhibit->map_id, 1);
        $this->assertNull($exhibit->image_id, 1);
        $this->assertEquals($exhibit->top_element, 'map');
        $this->assertEquals($exhibit->items_h_pos, 'right');
        $this->assertEquals($exhibit->items_v_pos, 'top');
        $this->assertEquals($exhibit->items_height, 'full');
        $this->assertEquals($exhibit->is_map, 1);
        $this->assertEquals($exhibit->is_timeline, 1);
        $this->assertEquals($exhibit->is_items, 1);
        $this->assertEquals($exhibit->h_percent, 50);
        $this->assertEquals($exhibit->v_percent, 50);
        $this->assertEquals($exhibit->default_map_bounds, 'BOUND()');
        $this->assertEquals($exhibit->default_map_zoom, 1);
        $this->assertEquals($exhibit->default_focus_date, 'date');
        $this->assertEquals($exhibit->default_vector_color, '#ffffff');
        $this->assertEquals($exhibit->default_vector_opacity, 50);
        $this->assertEquals($exhibit->default_stroke_opacity, 50);
        $this->assertEquals($exhibit->default_stroke_color, '#ffffff');
        $this->assertEquals($exhibit->default_stroke_width, 3);
        $this->assertEquals($exhibit->default_point_radius, 3);
        $this->assertEquals($exhibit->default_base_layer, 1);

    }

    /**
     * The validateForm() method should enforce title existence.
     *
     * @return void.
     */
    public function testValidateFormTitle()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Call with blank title.
        $errors = $neatline->validateForm('', null, null);
        $this->assertEquals($errors['title'], 'Enter a title.');

        // Call with title.
        $errors = $neatline->validateForm('Title', null, null);
        $this->assertEquals($errors, array());

    }

    /**
     * There has to be either a map or an image id, and not both.
     *
     * @return void.
     */
    public function testValidateFormMap()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Call with map id.
        $errors = $neatline->validateForm('Title', 1, 'none');
        $this->assertEquals($errors, array());

        // Call with image id.
        $errors = $neatline->validateForm('Title', 'none', 1);
        $this->assertEquals($errors, array());

        // Call with both.
        $errors = $neatline->validateForm('Title', 1, 1);
        $this->assertEquals($errors['map'], 'Choose a map or an image, not both.');

    }

    /**
     * saveForm() should save a map id if there is no image it.
     *
     * @return void.
     */
    public function testSaveFormValidMap()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Save with valid map id and check.
        $success = $neatline->saveForm('Title', 1, 'none');
        $this->assertNull($neatline->image_id);
        $this->assertEquals($neatline->name, 'Title');
        $this->assertEquals($neatline->is_map, 1);
        $this->assertEquals($neatline->is_timeline, 1);
        $this->assertEquals($neatline->is_items, 1);
        $this->assertEquals($neatline->map_id, 1);
        $this->assertEquals($neatline->top_element, 'map');
        $this->assertEquals($neatline->items_h_pos, 'right');
        $this->assertEquals($neatline->items_v_pos, 'bottom');
        $this->assertEquals($neatline->items_height, 'full');

    }

    /**
     * saveForm() should save an image id if there is not a map id.
     *
     * @return void.
     */
    public function testSaveFormValidImage()
    {

        // Create an exhibit.
        $neatline = $this->helper->_createNeatline();

        // Save with valid map id and check.
        $success = $neatline->saveForm('Title', 'none', 1);
        $this->assertNull($neatline->map_id);
        $this->assertEquals($neatline->name, 'Title');
        $this->assertEquals($neatline->is_map, 1);
        $this->assertEquals($neatline->is_timeline, 1);
        $this->assertEquals($neatline->is_items, 1);
        $this->assertEquals($neatline->image_id, 1);
        $this->assertEquals($neatline->top_element, 'map');
        $this->assertEquals($neatline->items_h_pos, 'right');
        $this->assertEquals($neatline->items_v_pos, 'bottom');
        $this->assertEquals($neatline->items_height, 'full');

    }

    /**
     * The getMap() method should return an exhibit's map record.
     *
     * @return void.
     */
    public function testGetMap()
    {

        // Create an exhibit and map.
        $exhibit = $this->helper->_createNeatline();
        $map = new NeatlineMapsMap();
        $map->save();
        $exhibit->saveForm('Title', $map->id, 'none');

        // Get the map and check.
        $retrievedMap = $exhibit->getMap();
        $this->assertEquals($map->id, $retrievedMap->id);

    }

    /**
     * When there is no map, getMap() method should return null.
     *
     * @return void.
     */
    public function testGetMapWithNullKey()
    {

        // Create an exhibit and map.
        $exhibit = $this->helper->_createNeatline();
        $map = new NeatlineMapsMap();
        $map->save();
        $exhibit->saveForm('Title', 'none', 'none');

        // Get the map and check.
        $retrievedMap = $exhibit->getMap();
        $this->assertNull($retrievedMap);

    }

    /**
     * The getImage() method should return an exhibit's image record.
     *
     * @return void.
     */
    public function testGetImage()
    {

        // TODO: How to mock a file?

    }

    /**
     * When there is no map, getMap() method should return null.
     *
     * @return void.
     */
    public function testGetImageWithNullKey()
    {

        // Create an exhibit and map.
        $exhibit = $this->helper->_createNeatline();
        $map = new NeatlineMapsMap();
        $map->save();
        $exhibit->saveForm('Title', 'none', 'none');

        // Get the map and check.
        $retrievedImage = $exhibit->getMap();
        $this->assertNull($retrievedImage);

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
        $this->assertEquals($neatline->default_focus_date, 'date');

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

        // Save.
        $neatline->saveViewportArrangement(
            1,
            1,
            1,
            'map',
            'right',
            'top',
            'full',
            40,
            60
        );

        // Check.
        $this->assertEquals($neatline->is_map, 1);
        $this->assertEquals($neatline->is_timeline, 1);
        $this->assertEquals($neatline->is_items, 1);
        $this->assertEquals($neatline->top_element, 'map');
        $this->assertEquals($neatline->items_h_pos, 'right');
        $this->assertEquals($neatline->items_v_pos, 'top');
        $this->assertEquals($neatline->items_height, 'full');
        $this->assertEquals($neatline->h_percent, 40);
        $this->assertEquals($neatline->v_percent, 60);

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
     * The getRecordIdByItem() method should return the id of the data
     * record for the passed item in the current exhibit.
     *
     * @return void.
     */
    public function testGetRecordIdByItemWithRecord()
    {

        // Create an exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Create a record.
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Check for the correct id.
        $retrievedId = $neatline->getRecordIdByItem($item);
        $this->assertNotNull($retrievedId);
        $this->assertEquals($retrievedId, $record->id);

    }

    /**
     * The getRecordIdByItem() method should null if there is no extant
     * data record for the passed item.
     *
     * @return void.
     */
    public function testGetRecordIdByItemWithNoRecord()
    {

        // Create an exhibit and item.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();

        // Check for null.
        $retrievedId = $neatline->getRecordIdByItem($item);
        $this->assertNull($retrievedId);

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

    /**
     * The save() method should commit the record if there is a map id and not
     * an image id or an image id and not a map id.
     *
     * @return void.
     */
    public function testSaveSuccess()
    {

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Map id, no image id.
        $exhibit->map_id = 1;
        $exhibit->image_id = null;
        $exhibit->save();

        // Should save.
        $this->assertEquals($exhibit->map_id, 1);

        // Image id, no map id.
        $exhibit->map_id = null;
        $exhibit->image_id = 1;
        $exhibit->save();

        // Should save.
        $this->assertEquals($exhibit->image_id, 1);

    }

    /**
     * The save() method should not commit the record if there is a map id
     * and an image id set on the row.
     *
     * @return void.
     */
    public function testSaveFailure()
    {

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline();
        $exhibit->map_id = 1;
        $exhibit->image_id = 1;

        // Should not save.
        $this->assertFalse($exhibit->save());

    }

    /**
     * setStyle() should save a row value if the passed value is different
     * from the system default.
     *
     * @return void.
     */
    public function testSetStyleWithNovelValues()
    {

        // Create a record.
        $exhibit = $this->helper->_createNeatline();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Set.
        $this->assertTrue($exhibit->setStyle('vector_color', '#ffffff'));
        $this->assertTrue($exhibit->setStyle('vector_opacity', 5));
        $this->assertTrue($exhibit->setStyle('stroke_color', '#ffffff'));
        $this->assertTrue($exhibit->setStyle('stroke_opacity', 5));
        $this->assertTrue($exhibit->setStyle('stroke_width', 5));
        $this->assertTrue($exhibit->setStyle('point_radius', 5));

        // Check.
        $this->assertEquals($exhibit->default_vector_color, '#ffffff');
        $this->assertEquals($exhibit->default_vector_opacity, 5);
        $this->assertEquals($exhibit->default_stroke_color, '#ffffff');
        $this->assertEquals($exhibit->default_stroke_opacity, 5);
        $this->assertEquals($exhibit->default_stroke_width, 5);
        $this->assertEquals($exhibit->default_point_radius, 5);

    }

    /**
     * getStyle() should return the exhibit-specific default when one exists.
     *
     * @return void.
     */
    public function testGetStyleWithExhibitDefaults()
    {

        // Create a record.
        $exhibit = $this->helper->_createNeatline();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Set exhibit defaults.
        $exhibit->default_vector_color = '#ffffff';
        $exhibit->default_stroke_color = '#ffffff';
        $exhibit->default_vector_opacity = 5;
        $exhibit->default_stroke_opacity = 5;
        $exhibit->default_stroke_width = 5;
        $exhibit->default_point_radius = 5;

        // Check.
        $this->assertEquals($exhibit->getStyle('vector_color'), '#ffffff');
        $this->assertEquals($exhibit->getStyle('vector_opacity'), 5);
        $this->assertEquals($exhibit->getStyle('stroke_color'), '#ffffff');
        $this->assertEquals($exhibit->getStyle('stroke_opacity'), 5);
        $this->assertEquals($exhibit->getStyle('stroke_width'), 5);
        $this->assertEquals($exhibit->getStyle('point_radius'), 5);

    }

    /**
     * getStyle() should return the system default when an exhibit-specific
     * default does not exist.
     *
     * @return void.
     */
    public function testGetStyleWithoutExhibitDefaults()
    {

        // Create a record.
        $exhibit = $this->helper->_createNeatline();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Check.
        $this->assertEquals($exhibit->getStyle('vector_color'), '#5033de');
        $this->assertEquals($exhibit->getStyle('vector_opacity'), 20);
        $this->assertEquals($exhibit->getStyle('stroke_color'), '#1e2ee6');
        $this->assertEquals($exhibit->getStyle('stroke_opacity'), 70);
        $this->assertEquals($exhibit->getStyle('stroke_width'), 4);
        $this->assertEquals($exhibit->getStyle('point_radius'), 6);

    }

    /**
     * getNumberOfRecords() should return 0 when there are no records.
     *
     * @return void.
     */
    public function testGetNumberOfRecordsWhenNoRecordsExist()
    {

        // Create exhibits.
        $neatline = $this->helper->_createNeatline();

        // Check count.
        $this->assertEquals($neatline->getNumberOfRecords(), 0);

    }

    /**
     * getNumberOfRecords() should return the exhibit record count.
     *
     * @return void.
     */
    public function testGetNumberOfRecordsWhenRecordsExist()
    {

        // Create exhibits.
        $neatline1 = $this->helper->_createNeatline();
        $neatline2 = $this->helper->_createNeatline();

        // Create records.
        $record1 = new NeatlineDataRecord(null, $neatline1);
        $record2 = new NeatlineDataRecord(null, $neatline1);
        $record3 = new NeatlineDataRecord(null, $neatline1);
        $record4 = new NeatlineDataRecord(null, $neatline2);
        $record1->space_active = 1;
        $record2->space_active = 1;
        $record3->space_active = 1;
        $record4->space_active = 1;
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Check count.
        $this->assertEquals($neatline1->getNumberOfRecords(), 3);
        $this->assertEquals($neatline2->getNumberOfRecords(), 1);

    }

    /**
     * getBaseLayer() should return the default exhibit when there is
     * no local default setting.
     *
     * @return void.
     */
    public function testGetBaseLayerWithNoLocalSetting()
    {

        // Create exhibit.
        $neatline = $this->helper->_createNeatline();

        // Get base layer.
        $baseLayer = $neatline->getBaseLayer();

        // Check identity.
        $this->assertEquals($baseLayer->name, 'Google Physical');

    }

    /**
     * getBaseLayer() should return the locally set default when there
     * is a non-null value for the base layer key.
     *
     * @return void.
     */
    public function testGetBaseLayerWithLocalSetting()
    {

        // Create exhibit and layer.
        $neatline = $this->helper->_createNeatline();
        $layer = new NeatlineBaseLayer;
        $layer->name = 'Test Layer';
        $layer->save();

        // Set key.
        $neatline->default_base_layer = $layer->id;
        $neatline->save();

        // Get base layer.
        $baseLayer = $neatline->getBaseLayer();

        // Check identity.
        $this->assertEquals($baseLayer->name, 'Test Layer');

    }

    /**
     * getViewportProportions() should return system defaults when there are no
     * set values on the exhibit record.
     *
     * @return void.
     */
    public function testGetViewportProportionsWithNoLocalSettings()
    {

        // Set system defaults.
        set_option('h_percent', 25);
        set_option('v_percent', 85);

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Test for system defaults.
        $this->assertEquals(
            $exhibit->getViewportProportions(),
            array('horizontal' => 25, 'vertical' => 85)
        );

    }

    /**
     * getViewportProportions() should return record specific settings when
     * there are local values on the row.
     *
     * @return void.
     */
    public function testGetViewportProportionsWithLocalSettings()
    {

        // Set system defaults.
        set_option('h_percent', 25);
        set_option('v_percent', 85);

        // Create exhibit and set local values.
        $exhibit = $this->helper->_createNeatline();
        $exhibit->h_percent = 10;
        $exhibit->v_percent = 20;

        // Test for system defaults.
        $this->assertEquals(
            $exhibit->getViewportProportions(),
            array('horizontal' => 10, 'vertical' => 20)
        );

    }

    /**
     * setModified() should update the modified field.
     *
     * @return void.
     */
    public function testSetModified()
    {

        // Create exhibit, get time, set.
        $exhibit = $this->helper->_createNeatline();
        $timestamp = neatline_getTimestamp();
        $exhibit->setModified();

        // Get delta and check.
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertLessThanOrEqual(1, $delta);

    }

    /**
     * save() should trigger an update of the modified field.
     *
     * @return void.
     */
    public function testUpdateModifiedOnSave()
    {

        // Get time.
        $timestamp = neatline_getTimestamp();

        // Create an exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Check for column set.
        $this->assertNotNull($exhibit->modified);

        // Set the modified date back, get delta and check.
        $exhibit->modified = '2010-01-01 00:00:00';
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertGreaterThanOrEqual(1, $delta);

        // Set the modified date back, get delta and check.
        $exhibit->save();
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertLessThanOrEqual(1, $delta);

    }

}
