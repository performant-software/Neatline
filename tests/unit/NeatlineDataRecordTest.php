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

class Neatline_NeatlineDataRecordTest extends Omeka_Test_AppTestCase
{

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
        'stroke_color' => '#000000',
        'highlight_color' => '#ff0000',
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
        $record->parent_record_id =             1;
        $record->title =                        'title';
        $record->description =                  'description';
        $record->start_date =                   'startdate';
        $record->end_date =                     'enddate';
        $record->start_visible_date =           'startvisibledate';
        $record->end_visible_date =             'endvisibledate';
        $record->end_date =                     'enddate';
        $record->vector_color =                 '#ffffff';
        $record->stroke_color =                 '#ffffff';
        $record->highlight_color =              '#ffffff';
        $record->vector_opacity =               50;
        $record->stroke_opacity =               50;
        $record->stroke_width =                 3;
        $record->point_radius =                 3;
        $record->geocoverage =                  'POINT()';
        $record->left_percent =                 30;
        $record->right_percent =                80;
        $record->space_active =                 1;
        $record->time_active =                  1;
        $record->items_active =                 1;
        $record->display_order =                1;
        $record->map_bounds =                   'BOUND()';
        $record->map_zoom =                     5;
        $record->save();

        // Re-get the record object.
        $record = $this->_recordsTable->find(1);

        // Get.
        $this->assertEquals($record->parent_record_id, 1);
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->description, 'description');
        $this->assertEquals($record->start_date, 'startdate');
        $this->assertEquals($record->end_date, 'enddate');
        $this->assertEquals($record->start_visible_date, 'startvisibledate');
        $this->assertEquals($record->end_visible_date, 'endvisibledate');
        $this->assertEquals($record->vector_color, '#ffffff');
        $this->assertEquals($record->stroke_color, '#ffffff');
        $this->assertEquals($record->highlight_color, '#ffffff');
        $this->assertEquals($record->vector_opacity, 50);
        $this->assertEquals($record->stroke_opacity, 50);
        $this->assertEquals($record->stroke_width, 3);
        $this->assertEquals($record->point_radius, 3);
        $this->assertEquals($record->geocoverage, 'POINT()');
        $this->assertEquals($record->left_percent, 30);
        $this->assertEquals($record->right_percent, 80);
        $this->assertEquals($record->space_active, 1);
        $this->assertEquals($record->time_active, 1);
        $this->assertEquals($record->items_active, 1);
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
        $this->assertEquals($record->items_active, 0);

        // Ambiguity percentages should be 0 and 100.
        $this->assertEquals($record->left_percent, 0);
        $this->assertEquals($record->right_percent, 100);

    }

    /**
     * If null is passed for the $item parameter to __construct(), the record
     * should not be associated with any item.
     *
     * @return void.
     */
    public function testAttributeDefaultsWithNoParentItem()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->item_id, null);

    }

    /**
     * getItem() should return the parent item when one exists.
     *
     * @return void.
     */
    public function testGetItemWithItem()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Get the item.
        $retrievedItem = $record->getItem();
        $this->assertEquals($item->id, $retrievedItem->id);

    }

    /**
     * getItem() should return null when there is not a parent item.
     *
     * @return void.
     */
    public function testGetItemWithNoItem()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Get the item.
        $retrievedItem = $record->getItem();
        $this->assertNull($retrievedItem);

    }

    /**
     * getExhibit() should return the parent exhibit.
     *
     * @return void.
     */
    public function testGetExhibit()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Get the exhibit.
        $retrievedExhibit = $record->getExhibit();
        $this->assertEquals($neatline->id, $retrievedExhibit->id);

    }

    /**
     * getParentRecord() should return the parent record when one exists.
     *
     * @return void.
     */
    public function testGetParentRecordWithRecord()
    {

        // Create exhibit and record.
        $exhibit = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->save();

        // Create record with parent record.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Get the parent record.
        $retrievedRecord = $record2->getParentRecord();
        $this->assertEquals($retrievedRecord->id, $record1->id);

    }

    /**
     * getParentRecord() should return null when there is not a parent
     * record.
     *
     * @return void.
     */
    public function testGetParentRecordWithNoRecord()
    {

        // Create exhibit and record.
        $exhibit = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Try to get the parent record.
        $this->assertNull($record->getParentRecord());

    }

    /**
     * setNotEmpty() should set value when value is not null or ''.
     *
     * @return void.
     */
    public function testSetNotEmptyWithNonEmptyValue()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test with empty value, check for set.
        $record->setNotEmpty('title', 'Title');
        $this->assertNotNull($record->title);
        $this->assertEquals($record->title, 'Title');

    }

    /**
     * setNotEmpty() should set null when value is null or ''.
     *
     * @return void.
     */
    public function testSetNotEmptyWithEmptyValue()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test with empty value, check for set.
        $record->setNotEmpty('title', '');
        $this->assertNull($record->title);
        $record->setNotEmpty('title', null);
        $this->assertNull($record->title);

        // Test with populated value, check for set.
        $record->title = 'Title';
        $record->setNotEmpty('title', '');
        $this->assertNull($record->title);
        $record->title = 'Title';
        $record->setNotEmpty('title', null);
        $this->assertNull($record->title);

    }

    /**
     * setSlug() should not set value when slug is not unique.
     *
     * @return void.
     */
    public function testSetSlug()
    {

        // Create item.
        $item = $this->helper->_createItem();

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Create two records.
        $record1 = new NeatlineDataRecord($item, $exhibit);
        $record1->save();
        $record2 = new NeatlineDataRecord($item, $exhibit);
        $record2->slug = 'taken-slug';
        $record2->save();

        // Set duplicate slug.
        $record1->setSlug('taken-slug');
        $this->assertNull($record1->slug);

        // Set unique slug.
        $record1->setSlug('new-slug');
        $this->assertEquals($record1->slug, 'new-slug');

    }

    /**
     * The status trackers can only take native boolean values as input
     * parameters. The setStatus() method should check to make sure that
     * the input is boolean and set the integer value.
     *
     * @return void.
     */
    public function testSetStatusWithValidData()
    {

        // Create a record.
        $record = $this->helper->_createRecord();

        // Test true.
        $success = $record->setStatus('items', true);
        $this->assertEquals($record->items_active, 1);
        $this->assertTrue($success);

        // Test false.
        $success = $record->setStatus('items', false);
        $this->assertEquals($record->items_active, 0);
        $this->assertTrue($success);

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

        // Test invalid items.
        $failure = $record->setStatus('items', 'notBoolean');
        $this->assertEquals($record->items_active, 0);
        $this->assertFalse($failure);

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
        $this->assertEquals($record->left_percent, 50);
        $this->assertEquals($record->right_percent, 60);
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
        $this->assertEquals($record->left_percent, 0);
        $this->assertEquals($record->right_percent, 100);
        $this->assertFalse($failure);

        // Try to make one of the values too small.
        $failure = $record->setPercentages(-10, 90);
        $this->assertEquals($record->left_percent, 0);
        $this->assertEquals($record->right_percent, 100);
        $this->assertFalse($failure);

        // Try to make one of the values too large.
        $failure = $record->setPercentages(10, 110);
        $this->assertEquals($record->left_percent, 0);
        $this->assertEquals($record->right_percent, 100);
        $this->assertFalse($failure);

        // Try to make the values non-integer.
        $failure = $record->setPercentages('notInt', 100);
        $this->assertEquals($record->left_percent, 0);
        $this->assertEquals($record->right_percent, 100);
        $this->assertFalse($failure);

    }

    /**
     * When a non-style column name is passed to setStyle(), return
     * false and do not set the value.
     *
     * @return void.
     */
    public function testSetStyleFalseForNonStyle()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set.
        $record->setStyle('title', 'shouldNotSet');

        // Check.
        $this->assertNull($record->title);

    }

    /**
     * If a passed style attribute does not match the system defaults
     * and there is not an exhibit default for the column, set the value.
     *
     * @return void.
     */
    public function testSetStyleWithNoDefaultsWhenValueIsNovel()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set.
        $this->assertTrue($record->setStyle('vector_color', '#000000'));
        $this->assertTrue($record->setStyle('vector_opacity', 100));
        $this->assertTrue($record->setStyle('stroke_color', '#000000'));
        $this->assertTrue($record->setStyle('stroke_opacity', 100));
        $this->assertTrue($record->setStyle('stroke_width', 100));
        $this->assertTrue($record->setStyle('point_radius', 100));

        // Check.
        $this->assertEquals($record->vector_color, '#000000');
        $this->assertEquals($record->vector_opacity, 100);
        $this->assertEquals($record->stroke_color, '#000000');
        $this->assertEquals($record->stroke_opacity, 100);
        $this->assertEquals($record->stroke_width, 100);
        $this->assertEquals($record->point_radius, 100);

    }

    /**
     * If a passed style attribute matches the system defaults and there
     * is not an exhibit default for the column, do not set the value.
     *
     * @return void.
     */
    public function testSetStyleWithNoDefaultsWhenValueIsNotNovel()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set.
        $this->assertFalse($record->setStyle('vector_color', get_option('vector_color')));
        $this->assertFalse($record->setStyle('vector_opacity', get_option('vector_opacity')));
        $this->assertFalse($record->setStyle('stroke_color', get_option('stroke_color')));
        $this->assertFalse($record->setStyle('stroke_opacity', get_option('stroke_opacity')));
        $this->assertFalse($record->setStyle('stroke_width', get_option('stroke_width')));
        $this->assertFalse($record->setStyle('point_radius', get_option('point_radius')));

        // Check.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);

    }

    /**
     * If a passed style attribute does not match the exhibit default,
     * set the value.
     *
     * @return void.
     */
    public function testSetStyleWithDefaultsWhenValueIsNovel()
    {

        // Create a record, set exhibit defaults.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $neatline->default_vector_color = '#ffffff';
        $neatline->default_vector_opacity = 20;
        $neatline->default_stroke_color = '#ffffff';
        $neatline->default_stroke_opacity = 20;
        $neatline->default_stroke_width = 20;
        $neatline->default_point_radius = 20;
        $neatline->save();

        // Set.
        $this->assertTrue($record->setStyle('vector_color', '#000000'));
        $this->assertTrue($record->setStyle('vector_opacity', 100));
        $this->assertTrue($record->setStyle('stroke_color', '#000000'));
        $this->assertTrue($record->setStyle('stroke_opacity', 100));
        $this->assertTrue($record->setStyle('stroke_width', 100));
        $this->assertTrue($record->setStyle('point_radius', 100));

        // Check.
        $this->assertEquals($record->vector_color, '#000000');
        $this->assertEquals($record->vector_opacity, 100);
        $this->assertEquals($record->stroke_color, '#000000');
        $this->assertEquals($record->stroke_opacity, 100);
        $this->assertEquals($record->stroke_width, 100);
        $this->assertEquals($record->point_radius, 100);

    }

    /**
     * If a passed style attribute matches the exhibit default, do not set
     * the value.
     *
     * @return void.
     */
    public function testSetStyleWithDefaultsWhenValueIsNotNovel()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $neatline->default_vector_color = '#ffffff';
        $neatline->default_vector_opacity = 20;
        $neatline->default_stroke_color = '#ffffff';
        $neatline->default_stroke_opacity = 20;
        $neatline->default_stroke_width = 20;
        $neatline->default_point_radius = 20;
        $neatline->save();

        // Set.
        $this->assertFalse($record->setStyle('vector_color', '#ffffff'));
        $this->assertFalse($record->setStyle('vector_opacity', 20));
        $this->assertFalse($record->setStyle('stroke_color', '#ffffff'));
        $this->assertFalse($record->setStyle('stroke_opacity', 20));
        $this->assertFalse($record->setStyle('stroke_width', 20));
        $this->assertFalse($record->setStyle('point_radius', 20));

        // Check.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);

    }

    /**
     * If a passed style attribute matches the exhibit default and the record
     * style is not null, null out the value.
     *
     * @return void.
     */
    public function testSetStyleWithDefaultsWhenValueIsNotNovelWithExistingNonNullValue()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->vector_color = '#ffffff';
        $record->vector_opacity = 20;
        $record->stroke_color = '#ffffff';
        $record->stroke_opacity = 20;
        $record->stroke_width = 20;
        $record->point_radius = 20;
        $record->save();

        // Set.
        $this->assertTrue($record->setStyle('vector_color', get_option('vector_color')));
        $this->assertTrue($record->setStyle('vector_opacity', get_option('vector_opacity')));
        $this->assertTrue($record->setStyle('stroke_color', get_option('stroke_color')));
        $this->assertTrue($record->setStyle('stroke_opacity', get_option('stroke_opacity')));
        $this->assertTrue($record->setStyle('stroke_width', get_option('stroke_width')));
        $this->assertTrue($record->setStyle('point_radius', get_option('point_radius')));

        // Check.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);

        // Check getters.
        $this->assertEquals($record->getStyle('vector_color'), get_option('vector_color'));
        $this->assertEquals($record->getStyle('vector_opacity'),get_option('vector_opacity'));
        $this->assertEquals($record->getStyle('stroke_color'), get_option('stroke_color'));
        $this->assertEquals($record->getStyle('stroke_opacity'), get_option('stroke_opacity'));
        $this->assertEquals($record->getStyle('stroke_width'), get_option('stroke_width'));
        $this->assertEquals($record->getStyle('point_radius'), get_option('point_radius'));

    }

    /**
     * If 'null' is passed to setGeocoverage, do not set.
     *
     * @return void.
     */
    public function testSetGeocoverageWithNullValue()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $neatline->save();

        // Set record that is already null.
        $this->assertFalse($record->setGeocoverage('null'));
        $this->assertNull($record->vector_color);

        // Set record that has coverage.
        $record->geocoverage = 'POINT(1,0)';
        $this->assertFalse($record->setGeocoverage('null'));
        $this->assertEquals($record->geocoverage, 'POINT(1,0)');

    }

    /**
     * If anything other than 'null' is passed to setGeocoverage, set.
     *
     * @return void.
     */
    public function testSetGeocoverageWithNonNullValue()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $neatline->save();

        // Set record that is already null.
        $record->setGeocoverage('POINT(1,0)');
        $this->assertNull($record->vector_color);

        // Set record that has coverage.
        $record->geocoverage = 'POINT(1,0)';
        $record->setGeocoverage('POINT(2,0)');
        $this->assertEquals($record->geocoverage, 'POINT(2,0)');

    }

    /**
     * getStyle() should return a set row value when one exists and
     * there is not an exhibit default.
     *
     * @return void.
     */
    public function testGetStyleWithRowValueAndNoExhibitDefault()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set values.
        $record->vector_color = '#ffffff';
        $record->vector_opacity = 20;
        $record->stroke_color = '#ffffff';
        $record->stroke_opacity = 20;
        $record->stroke_width = 20;
        $record->point_radius = 20;
        $record->save();

        // Get and check.
        $this->assertEquals($record->getStyle('vector_color'), '#ffffff');
        $this->assertEquals($record->getStyle('vector_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_color'), '#ffffff');
        $this->assertEquals($record->getStyle('stroke_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_width'), 20);
        $this->assertEquals($record->getStyle('point_radius'), 20);

    }

    /**
     * getStyle() should return a set row value when one exists and
     * there is an exhibit default.
     *
     * @return void.
     */
    public function testGetStyleWithRowValueAndExhibitDefault()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set values.
        $record->vector_color = '#ffffff';
        $record->vector_opacity = 20;
        $record->stroke_color = '#ffffff';
        $record->stroke_opacity = 20;
        $record->stroke_width = 20;
        $record->point_radius = 20;
        $record->save();
        $neatline->default_vector_color = '#fffffg';
        $neatline->default_vector_opacity = 21;
        $neatline->default_stroke_color = '#fffffg';
        $neatline->default_stroke_opacity = 21;
        $neatline->default_stroke_width = 21;
        $neatline->default_point_radius = 21;
        $neatline->save();

        // Get and check.
        $this->assertEquals($record->getStyle('vector_color'), '#ffffff');
        $this->assertEquals($record->getStyle('vector_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_color'), '#ffffff');
        $this->assertEquals($record->getStyle('stroke_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_width'), 20);
        $this->assertEquals($record->getStyle('point_radius'), 20);

    }

    /**
     * getStyle() should return the exhibit default when one exists and
     * when a row value is not set.
     *
     * @return void.
     */
    public function testGetStyleWithNoRowValueAndExhibitDefault()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Set values.
        $neatline->default_vector_color = '#ffffff';
        $neatline->default_vector_opacity = 20;
        $neatline->default_stroke_color = '#ffffff';
        $neatline->default_stroke_opacity = 20;
        $neatline->default_stroke_width = 20;
        $neatline->default_point_radius = 20;
        $neatline->save();

        // Get and check.
        $this->assertEquals($record->getStyle('vector_color'), '#ffffff');
        $this->assertEquals($record->getStyle('vector_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_color'), '#ffffff');
        $this->assertEquals($record->getStyle('stroke_opacity'), 20);
        $this->assertEquals($record->getStyle('stroke_width'), 20);
        $this->assertEquals($record->getStyle('point_radius'), 20);

    }

    /**
     * getStyle() should return the system default there is no row value
     * and no exhibit default.
     *
     * @return void.
     */
    public function testGetStyleWithNoRowValueAndNoExhibitDefault()
    {

        // Create a record.
        $neatline = $this->helper->_createNeatline();
        $item = $this->helper->_createItem();
        $record = new NeatlineDataRecord($item, $neatline);
        $record->save();

        // Get and check.
        $this->assertEquals($record->getStyle('vector_color'), get_option('vector_color'));
        $this->assertEquals($record->getStyle('vector_opacity'), get_option('vector_opacity'));
        $this->assertEquals($record->getStyle('stroke_color'), get_option('stroke_color'));
        $this->assertEquals($record->getStyle('stroke_opacity'), get_option('stroke_opacity'));
        $this->assertEquals($record->getStyle('stroke_width'), get_option('stroke_width'));
        $this->assertEquals($record->getStyle('point_radius'), get_option('point_radius'));

    }

    /**
     * The getTitle() method should return the record title attribute when it
     * is not null; if it is null, try to default in the DC value.
     *
     * @return void.
     */
    public function testGetTitleWithItem()
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
     * When there is no parent item, getTitle() should return the record title,
     * and an empty string if the record attribute is null.
     *
     * @return void.
     */
    public function testGetTitleWithNoItem()
    {

        // Create an item, exhibit, and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return the native value.
        $record->title = 'Native Title';
        $this->assertEquals($record->getTitle(), 'Native Title');

        // Should return the native value.
        $record->title = null;
        $this->assertEquals($record->getTitle(), '');

    }

    /**
     * getSlug() should return the slug when there is a non-null value and
     * an empty string with the value is null.
     *
     * @return void.
     */
    public function testGetSlug()
    {

        // Create an item, exhibit, and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return the native value.
        $record->slug = 'slug';
        $this->assertEquals($record->getSlug(), 'slug');

        // Should return empty string.
        $record->slug = null;
        $this->assertEquals($record->getSlug(), '');

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
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Description',
            'Test description.');

        // Should return the DC value.
        $this->assertEquals($record->getDescription(), 'Test description.');

        // Should return the native value.
        $record->description = 'Native description.';
        $this->assertEquals($record->getDescription(), 'Native description.');

    }

    /**
     * When there is no parent item, getDescription() should return the record description,
     * and an empty string if the record attribute is null.
     *
     * @return void.
     */
    public function testGetDescriptionWithNoItem()
    {

        // Create an item, exhibit, and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return the native value.
        $record->description = 'Native description.';
        $this->assertEquals($record->getDescription(), 'Native description.');

        // Should return the native value.
        $record->description = null;
        $this->assertEquals($record->getDescription(), '');

    }

    /**
     * The getLeftPercent() method should return the record left percent attribute
     * when it is not null; if it is null, return the default.
     *
     * @return void.
     */
    public function testGetLeftPercent()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Should return default.
        $this->assertEquals($record->getLeftPercent(), 0);

        // Should return the native value.
        $record->left_percent = 10;
        $this->assertEquals($record->getLeftPercent(), 10);

    }

    /**
     * The getRightPercent() method should return the record right percent attribute
     * when it is not null; if it is null, return the default.
     *
     * @return void.
     */
    public function testGetRightPercent()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Should return default.
        $this->assertEquals($record->getRightPercent(), 100);

        // Should return the native value.
        $record->right_percent = 90;
        $this->assertEquals($record->getRightPercent(), 90);

    }

    /**
     * The getGeocoverage() method return the default value when there is no locally
     * set value and no parent record. When there is a local value that is not an
     * empty string, it should be returned.
     *
     * @return void.
     */
    public function testGetGeocoverageNoNeatlineFeaturesWithoutParentItem()
    {

        // Create an item, exhibit, and record.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return null when the value is null.
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // Should return empty WKT for empty string.
        $record->geocoverage = '';
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // Should return the value when the value is set.
        $record->geocoverage = 'POINT(0,1)';
        $this->assertEquals($record->getGeocoverage(), 'POINT(0,1)');

    }

    /**
     * The getGeocoverage() method return the DC coverage field when there is not a
     * locally-set value, a parent item exists, and the coverage field is not empty.
     *
     * @return void.
     */
    public function testGetGeocoverageNoNeatlineFeaturesWithParentItemEmptyGeocoverage()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Should return empty WKT.
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // Add an empty DC coverage field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Coverage',
            '');

        // Should return empty WKT.
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // When there is a locally set value, override.
        $record->geocoverage = 'POINT(11,12)';
        $this->assertEquals($record->getGeocoverage(), 'POINT(11,12)');

    }

    /**
     * The getGeocoverage() method return the DC coverage field when there is not a
     * locally-set value, a parent item exists, and the coverage field is not empty.
     *
     * @return void.
     */
    public function testGetGeocoverageNoNeatlineFeaturesWithParentItemNonEmptyGeocoverage()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Add a non-empty DC coverage field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Coverage',
            'POINT(10,11)');

        // Should return the DC value.
        $this->assertEquals($record->getGeocoverage(), 'POINT(10,11)');

        // When there is a locally set value, override.
        $record->geocoverage = 'POINT(11,12)';
        $this->assertEquals($record->getGeocoverage(), 'POINT(11,12)');

    }

    /**
     * The getStartDate() method should return the record start date when a
     * value is set.
     *
     * @return void.
     */
    public function testGetStartDateWithRecordValue()
    {

        // Create an exhibit and a record without a parent item.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Set record start date.
        $record->start_date = '1564-04-26 14:39:22';

        // Should return the local value.
        $this->assertEquals($record->getStartDate(), '1564-04-26 14:39:22');

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set record start date.
        $record->start_date = '1564-04-26 14:39:22';

        // Should return the local value.
        $this->assertEquals($record->getStartDate(), '1564-04-26 14:39:22');

    }

    /**
     * The getStartDate() method should return an empty sting when there is
     * no local start date value and the record does not have a parent item.
     *
     * @return void.
     */
    public function testGetStartDateWithNoRecordValueAndNoParentItem()
    {

        // Create an exhibit and a record without a parent item.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return an empty string.
        $this->assertEquals($record->getStartDate(), '');

    }

    /**
     * The getStartDate() method should return the DC date of the parent item
     * when there is a non-range date value in DC date.
     *
     * @return void.
     */
    public function testGetStartDateWithNoRecordValueAndParentItemWithStartDate()
    {

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Add a non-range date to the DC date field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1564-04-26 14:39:22');

        // Should return the DC date.
        $this->assertEquals($record->getStartDate(), '1564-04-26 14:39:22');

        // When there is a local value on the record, the local value should
        // override the DC value.
        $record->start_date = '1616-04-23 12:45:34';
        $this->assertEquals($record->getStartDate(), '1616-04-23 12:45:34');

    }

    /**
     * The getStartDate() method should return the first piece of the DC date
     * of the parent item when there is a range date value in DC date.
     *
     * @return void.
     */
    public function testGetStartDateWithNoRecordValueAndParentItemWithRangeDate()
    {

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Add a non-range date to the DC date field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1564-04-26 14:39:22/1616-04-23 12:45:34');

        // Should return the DC date.
        $this->assertEquals($record->getStartDate(), '1564-04-26 14:39:22');

        // When there is a local value on the record, the local value should
        // override the DC value.
        $record->start_date = '1616-04-23 12:45:34';
        $this->assertEquals($record->getStartDate(), '1616-04-23 12:45:34');

    }

    /**
     * The getendDate() method should return the record end date when a
     * value is set.
     *
     * @return void.
     */
    public function testGetEndDateWithRecordValue()
    {

        // Create an exhibit and a record without a parent item.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Set record end date.
        $record->end_date = '1564-04-26 14:39:22';

        // Should return the local value.
        $this->assertEquals($record->getEndDate(), '1564-04-26 14:39:22');

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set record start date.
        $record->end_date = '1564-04-26 14:39:22';

        // Should return the local value.
        $this->assertEquals($record->getEndDate(), '1564-04-26 14:39:22');

    }

    /**
     * The getendDate() method should return an empty sting when there is
     * no local end date value and the record does not have a parent item.
     *
     * @return void.
     */
    public function testGetEndDateWithNoRecordValueAndNoParentItem()
    {

        // Create an exhibit and a record without a parent item.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Should return an empty string.
        $this->assertEquals($record->getEndDate(), '');

    }

    /**
     * The getEndDate() method should return an empty string when there is a
     * non-range date value in DC date.
     *
     * @return void.
     */
    public function testGetEndDateWithNoRecordValueAndParentItemWithStartDate()
    {

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Add a non-range date to the DC date field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1564-04-26 14:39:22');

        // Should return empty string.
        $this->assertEquals($record->getEndDate(), '');

        // When there is a local value on the record, the local value should
        // override the DC value.
        $record->end_date = '1916-04-23 12:45:34';
        $this->assertEquals($record->getEndDate(), '1916-04-23 12:45:34');

    }

    /**
     * The getEndDate() method should return the second piece of the DC date
     * of the parent item when there is a range date value in DC date.
     *
     * @return void.
     */
    public function testGetEndDateWithNoRecordValueAndParentItemWithRangeDate()
    {

        // Create an exhibit and a record with a parent item.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Add a non-range date to the DC date field on the parent item.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1564-04-26 14:39:22/1616-04-23 12:45:34');

        // Should return the DC date.
        $this->assertEquals($record->getEndDate(), '1616-04-23 12:45:34');

        // When there is a local value on the record, the local value should
        // override the DC value.
        $record->end_date = '1916-04-23 12:45:34';
        $this->assertEquals($record->getEndDate(), '1916-04-23 12:45:34');

    }

    /**
     * The getStartVisibleDate() method should return the record start visible
     * date when a value is set.
     *
     * @return void.
     */
    public function testGetStartVisibleDateWithRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->save();

        // Create record with parent record.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->parent_record_id = $record1->id;
        $record2->start_visible_date = '1564-04-26 14:39:22';
        $record2->save();

        // Should return the local value.
        $this->assertEquals($record2->getStartVisibleDate(), '1564-04-26 14:39:22');

    }

    /**
     * The getStartVisibleDate() method should return an empty string when
     * no record-level value is set.
     *
     * @return void.
     */
    public function testGetStartVisibleDateWithNoRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Should return the local value.
        $this->assertEquals($record->getStartVisibleDate(), '');

    }

    /**
     * The getStartVisibleDate() method should return the start visible date
     * of the parent record when a parent record exists and the local record
     * value is not set.
     *
     * @return void.
     */
    public function testGetStartVisibleDateWithParentRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->start_visible_date = '1564-04-26 14:39:22';
        $record1->save();

        // Create record with parent record.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Should return the local value.
        $this->assertEquals($record2->getStartVisibleDate(), '1564-04-26 14:39:22');

    }

    /**
     * The getEndVisibleDate() method should return the record start visible
     * date when a value is set.
     *
     * @return void.
     */
    public function testGetEndVisibleDateWithRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->save();

        // Create record with parent record.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->parent_record_id = $record1->id;
        $record2->end_visible_date = '1564-04-26 14:39:22';
        $record2->save();

        // Should return the local value.
        $this->assertEquals($record2->getEndVisibleDate(), '1564-04-26 14:39:22');

    }

    /**
     * The getEndVisibleDate() method should return an empty string when
     * no record-level value is set.
     *
     * @return void.
     */
    public function testGetEndVisibleDateWithNoRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Should return the local value.
        $this->assertEquals($record->getEndVisibleDate(), '');

    }

    /**
     * The getEndVisibleDate() method should return the start visible date
     * of the parent record when a parent record exists and the local record
     * value is not set.
     *
     * @return void.
     */
    public function testGetEndVisibleDateWithParentRecordValue()
    {

        // Create an exhibit and a record.
        $exhibit = $this->helper->_createNeatline();
        $record1 = new NeatlineDataRecord(null, $exhibit);
        $record1->end_visible_date = '1564-04-26 14:39:22';
        $record1->save();

        // Create record with parent record.
        $record2 = new NeatlineDataRecord(null, $exhibit);
        $record2->parent_record_id = $record1->id;
        $record2->save();

        // Should return the local value.
        $this->assertEquals($record2->getEndVisibleDate(), '1564-04-26 14:39:22');

    }

    /**
     * The buildEditFormJson() method should construct a JSON object to populate
     * the record edit form in the editor.
     *
     * @return void.
     */
    public function testBuildEditFormJsonWithData()
    {

        // Create an item and exhibit.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Populate fields.
        $record->title =                self::$__testParams['title'];
        $record->slug =                 self::$__testParams['slug'];
        $record->description =          self::$__testParams['description'];
        $record->start_date =           self::$__testParams['start_date'];
        $record->end_date =             self::$__testParams['end_date'];
        $record->start_visible_date =   self::$__testParams['start_visible_date'];
        $record->end_visible_date =     self::$__testParams['end_visible_date'];
        $record->vector_color =         self::$__testParams['vector_color'];
        $record->stroke_color =         self::$__testParams['stroke_color'];
        $record->highlight_color =      self::$__testParams['highlight_color'];
        $record->vector_opacity =       self::$__testParams['vector_opacity'];
        $record->stroke_opacity =       self::$__testParams['stroke_opacity'];
        $record->stroke_width =         self::$__testParams['stroke_width'];
        $record->point_radius =         self::$__testParams['point_radius'];
        $record->left_percent =         self::$__testParams['left_percent'];
        $record->right_percent =        self::$__testParams['right_percent'];
        $record->geocoverage =          self::$__testParams['geocoverage'];
        $record->space_active =         self::$__testParams['space_active'];
        $record->time_active =          self::$__testParams['time_active'];
        $record->save();

        // Ping the method for the json.
        $json = $record->buildEditFormJson();

        // Check the construction.
        $this->assertContains(
            '"title":"' . self::$__testParams['title'] . '"',
            $json
        );

        $this->assertContains(
            '"slug":"' . self::$__testParams['slug'] . '"',
            $json
        );

        $this->assertContains(
            '"description":"' . self::$__testParams['description'] . '"',
            $json
        );

        $this->assertContains(
            '"start_date":"' . self::$__testParams['start_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_date":"' . self::$__testParams['end_date'] . '"',
            $json
        );

        $this->assertContains(
            '"start_visible_date":"' . self::$__testParams['start_visible_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_visible_date":"' . self::$__testParams['end_visible_date'] . '"',
            $json
        );

        $this->assertContains(
            '"left_percent":' . self::$__testParams['left_percent'],
            $json
        );

        $this->assertContains(
            '"right_percent":' . self::$__testParams['right_percent'],
            $json
        );

        $this->assertContains(
            '"vector_color":"' . self::$__testParams['vector_color'] . '"',
            $json
        );

        $this->assertContains(
            '"stroke_color":"' . self::$__testParams['stroke_color'] . '"',
            $json
        );

        $this->assertContains(
            '"highlight_color":"' . self::$__testParams['highlight_color'] . '"',
            $json
        );

        $this->assertContains(
            '"vector_opacity":' . self::$__testParams['vector_opacity'],
            $json
        );

        $this->assertContains(
            '"stroke_opacity":' . self::$__testParams['stroke_opacity'],
            $json
        );

        $this->assertContains(
            '"stroke_width":' . self::$__testParams['stroke_width'],
            $json
        );

        $this->assertContains(
            '"point_radius":' . self::$__testParams['point_radius'],
            $json
        );

    }

    /**
     * The buildEditFormJson() method should cast integer styles.
     *
     * @return void.
     */
    public function testBuildEditFormJsonIntTypecasting()
    {

        // Create an item and exhibit.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);

        // Populate fields.
        $record->title =                self::$__testParams['title'];
        $record->slug =                 self::$__testParams['slug'];
        $record->description =          self::$__testParams['description'];
        $record->start_date =           self::$__testParams['start_date'];
        $record->end_date =             self::$__testParams['end_date'];
        $record->start_visible_date =   self::$__testParams['start_visible_date'];
        $record->end_visible_date =     self::$__testParams['end_visible_date'];
        $record->vector_color =         self::$__testParams['vector_color'];
        $record->stroke_color =         self::$__testParams['stroke_color'];
        $record->highlight_color =      self::$__testParams['highlight_color'];
        $record->vector_opacity =       '20';
        $record->stroke_opacity =       '30';
        $record->stroke_width =         '5';
        $record->point_radius =         '6';
        $record->left_percent =         '0';
        $record->right_percent =        '100';
        $record->geocoverage =          self::$__testParams['geocoverage'];
        $record->space_active =         self::$__testParams['space_active'];
        $record->time_active =          self::$__testParams['time_active'];
        $record->save();

        // Ping the method for the json.
        $json = $record->buildEditFormJson();

        // Check the construction.
        $this->assertContains(
            '"title":"' . self::$__testParams['title'] . '"',
            $json
        );

        $this->assertContains(
            '"slug":"' . self::$__testParams['slug'] . '"',
            $json
        );

        $this->assertContains(
            '"description":"' . self::$__testParams['description'] . '"',
            $json
        );

        $this->assertContains(
            '"start_date":"' . self::$__testParams['start_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_date":"' . self::$__testParams['end_date'] . '"',
            $json
        );

        $this->assertContains(
            '"start_visible_date":"' . self::$__testParams['start_visible_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_visible_date":"' . self::$__testParams['end_visible_date'] . '"',
            $json
        );

        $this->assertContains(
            '"left_percent":0',
            $json
        );

        $this->assertContains(
            '"right_percent":100',
            $json
        );

        $this->assertContains(
            '"vector_color":"' . self::$__testParams['vector_color'] . '"',
            $json
        );

        $this->assertContains(
            '"stroke_color":"' . self::$__testParams['stroke_color'] . '"',
            $json
        );

        $this->assertContains(
            '"highlight_color":"' . self::$__testParams['highlight_color'] . '"',
            $json
        );

        $this->assertContains(
            '"vector_opacity":20',
            $json
        );

        $this->assertContains(
            '"stroke_opacity":30',
            $json
        );

        $this->assertContains(
            '"stroke_width":5',
            $json
        );

        $this->assertContains(
            '"point_radius":6',
            $json
        );

    }

    /**
     * The buildEditFormJson() method should construct a JSON object to populate
     * the record edit form in the editor. When there is no data, default values
     * should be used.
     *
     * @return void.
     */
    public function testBuildEditFormJsonWithoutData()
    {

        // Create an item and exhibit.
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord(null, $neatline);
        $record->save();

        // Ping the method for the json.
        $json = $record->buildEditFormJson();

        // Check the construction.
        $this->assertContains(
            '"title":""',
            $json
        );

        $this->assertContains(
            '"slug":""',
            $json
        );

        $this->assertContains(
            '"description":""',
            $json
        );

        $this->assertContains(
            '"start_date":""',
            $json
        );

        $this->assertContains(
            '"end_date":""',
            $json
        );

        $this->assertContains(
            '"start_visible_date":""',
            $json
        );

        $this->assertContains(
            '"end_visible_date":""',
            $json
        );

        $this->assertContains(
            '"left_percent":0',
            $json
        );

        $this->assertContains(
            '"right_percent":100',
            $json
        );

        $this->assertContains(
            '"vector_color":"' . get_option('vector_color') . '"',
            $json
        );

        $this->assertContains(
            '"stroke_color":"' . get_option('stroke_color') . '"',
            $json
        );

        $this->assertContains(
            '"highlight_color":"' . get_option('highlight_color') . '"',
            $json
        );

        $this->assertContains(
            '"vector_opacity":' . (int) get_option('vector_opacity'),
            $json
        );

        $this->assertContains(
            '"stroke_opacity":' . (int) get_option('stroke_opacity'),
            $json
        );

        $this->assertContains(
            '"stroke_width":' . (int) get_option('stroke_width'),
            $json
        );

        $this->assertContains(
            '"point_radius":' . (int) get_option('point_radius'),
            $json
        );

    }

    /**
     * The buildEditFormForNewRecordJson() method should construct a
     * starting JSON object for a fresh Omeka-item-based record that
     * defaults in DC values.
     *
     * @return void.
     */
    public function testBuildEditFormForNewRecordWithSingleDateJson()
    {

        // Create an item.
        $item = $this->helper->_createItem();

        // Create title element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Title',
            'Test Title');

        // Create description element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Description',
            'Test description.');

        // Create date element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1616-04-23 12:45:34');

        // Ping the method for the json.
        $json = NeatlineDataRecord::buildEditFormForNewRecordJson($item);

        // Check the construction.
        $this->assertContains(
            '"title":"Test Title"',
            $json
        );

        $this->assertContains(
            '"description":"Test description."',
            $json
        );

        $this->assertContains(
            '"start_date":"1616-04-23 12:45:34"',
            $json
        );

        $this->assertContains(
            '"end_date":""',
            $json
        );

    }

    /**
     * The buildEditFormForNewRecordJson() method should construct a
     * starting JSON object for a fresh Omeka-item-based record that
     * defaults in DC values. When there is a DC-specification date range
     * in the DC date field (two timestamps separated by a slash), the
     * two dates should be split and assigned to the start and end fields.
     *
     * @return void.
     */
    public function testBuildEditFormForNewRecordWithDateRangeJson()
    {

        // Create an item.
        $item = $this->helper->_createItem();

        // Create title element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Title',
            'Test Title');

        // Create description element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Description',
            'Test description.');

        // Create date element.
        $this->helper->_createElementText(
            $item,
            'Dublin Core',
            'Date',
            '1564-04-26 14:39:22/1616-04-23 12:45:34');

        // Ping the method for the json.
        $json = NeatlineDataRecord::buildEditFormForNewRecordJson($item);

        // Check the construction.
        $this->assertContains(
            '"title":"Test Title"',
            $json
        );

        $this->assertContains(
            '"description":"Test description."',
            $json
        );

        $this->assertContains(
            '"start_date":"1564-04-26 14:39:22"',
            $json
        );

        $this->assertContains(
            '"end_date":"1616-04-23 12:45:34"',
            $json
        );

    }

    /**
     * The resetStyles() method should null out all style parameters.
     *
     * @return void.
     */
    public function testResetStyles()
    {

        // Create an item, exhibit, and record.
        $item = $this->helper->_createItem();
        $neatline = $this->helper->_createNeatline();
        $record = new NeatlineDataRecord($item, $neatline);

        // Set styles.
        $record->vector_color = '#ffffff';
        $record->stroke_color = '#ffffff';
        $record->highlight_color = '#ffffff';
        $record->vector_opacity = 50;
        $record->stroke_opacity = 50;
        $record->stroke_width = 50;
        $record->point_radius = 50;

        // Reset.
        $record->resetStyles();

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
     * save() should update the modified field on the parent exhibit.
     *
     * @return void.
     */
    public function testUpdateExhibitModifiedOnSave()
    {

        // Get time.
        $timestamp = neatline_getTimestamp();

        // Set the modified date back, get delta and check.
        $exhibit = $this->helper->_createNeatline();
        $exhibit->modified = '2010-01-01 00:00:00';
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertGreaterThanOrEqual(1, $delta);

        // Create a record and save.
        $record = new NeatlineDataRecord(null, $exhibit);
        $record->save();

        // Reget the record.
        $exhibit = $record->getExhibit();

        // Get delta and check.
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertLessThanOrEqual(1, $delta);

    }

}
