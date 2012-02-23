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
        'description' => 'Test description.',
        'start_date' => 'April 26, 1564',
        'start_time' => '6:00 AM',
        'end_date' => 'April 23, 1616',
        'end_time' => '6:00 AM',
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
        $record->title =                        'title';
        $record->description =                  'description';
        $record->start_date =                   'startdate';
        $record->start_time =                   'starttime';
        $record->end_date =                     'enddate';
        $record->end_time =                     'endtime';
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
        $record->display_order =                1;
        $record->map_bounds =                   'BOUND()';
        $record->map_zoom =                     5;
        $record->save();

        // Re-get the record object.
        $record = $this->_recordsTable->find(1);

        // Get.
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->description, 'description');
        $this->assertEquals($record->start_date, 'startdate');
        $this->assertEquals($record->start_time, 'starttime');
        $this->assertEquals($record->end_date, 'enddate');
        $this->assertEquals($record->end_time, 'endtime');
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
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // Should return empty WKT for empty string.
        $record->geocoverage = '';
        $this->assertEquals($record->getGeocoverage(), 'POINT()');

        // Should return the value when the value is set.
        $record->geocoverage = 'POINT(0,1)';
        $this->assertEquals($record->getGeocoverage(), 'POINT(0,1)');

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

        // Ping the method for the json.
        $json = $record->buildEditFormJson();

        // Check the construction.
        $this->assertContains(
            '"title":"' . self::$__testParams['title'] . '"',
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
            '"start_time":"' . self::$__testParams['start_time'] . '"',
            $json
        );

        $this->assertContains(
            '"end_date":"' . self::$__testParams['end_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_time":"' . self::$__testParams['end_time'] . '"',
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
        $record->title =            self::$__testParams['title'];
        $record->description =      self::$__testParams['description'];
        $record->start_date =       self::$__testParams['start_date'];
        $record->start_time =       self::$__testParams['start_time'];
        $record->end_date =         self::$__testParams['end_date'];
        $record->end_time =         self::$__testParams['end_time'];
        $record->vector_color =     self::$__testParams['vector_color'];
        $record->stroke_color =     self::$__testParams['stroke_color'];
        $record->highlight_color =  self::$__testParams['highlight_color'];
        $record->vector_opacity =   '20';
        $record->stroke_opacity =   '30';
        $record->stroke_width =     '5';
        $record->point_radius =     '6';
        $record->left_percent =     '0';
        $record->right_percent =    '100';
        $record->geocoverage =      self::$__testParams['geocoverage'];
        $record->space_active =     self::$__testParams['space_active'];
        $record->time_active =      self::$__testParams['time_active'];
        $record->save();

        // Ping the method for the json.
        $json = $record->buildEditFormJson();

        // Check the construction.
        $this->assertContains(
            '"title":"' . self::$__testParams['title'] . '"',
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
            '"start_time":"' . self::$__testParams['start_time'] . '"',
            $json
        );

        $this->assertContains(
            '"end_date":"' . self::$__testParams['end_date'] . '"',
            $json
        );

        $this->assertContains(
            '"end_time":"' . self::$__testParams['end_time'] . '"',
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
            '"description":""',
            $json
        );

        $this->assertContains(
            '"start_date":""',
            $json
        );

        $this->assertContains(
            '"start_time":""',
            $json
        );

        $this->assertContains(
            '"end_date":""',
            $json
        );

        $this->assertContains(
            '"end_time":""',
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
    public function testBuildEditFormForNewRecordJson()
    {

        // Create an item and texts.
        $item = $this->helper->_createItem();
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
            '"start_date":""',
            $json
        );

        $this->assertContains(
            '"start_time":""',
            $json
        );

        $this->assertContains(
            '"end_date":""',
            $json
        );

        $this->assertContains(
            '"end_time":""',
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
            '"vector_opacity":' . (int) get_option('vector_opacity'),
            $json
        );

        $this->assertContains(
            '"stroke_opacity":' . (int) get_option('stroke_opacity'),
            $json
        );

        $this->assertContains(
            '"stroke_color":"' . get_option('stroke_color') . '"',
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
