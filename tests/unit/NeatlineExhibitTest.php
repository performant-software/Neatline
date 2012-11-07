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
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_NeatlineExhibitTest extends Neatline_Test_AppTestCase
{

    /**
     * Test get and set on columns.
     *
     * @return void.
     */
    public function testAttributeAccess()
    {

        // Create a record, capture time.
        $exhibit = new NeatlineExhibit();

        // Set.
        $exhibit->title =                   'title';
        $exhibit->description =             'Description.';
        $exhibit->slug =                    'slug';
        $exhibit->public =                  1;
        $exhibit->query =                   'query';
        $exhibit->image_id =                1;
        $exhibit->top_element =             'map';
        $exhibit->items_h_pos =             'right';
        $exhibit->items_v_pos =             'top';
        $exhibit->items_height =            'full';
        $exhibit->is_map =                  1;
        $exhibit->is_timeline =             1;
        $exhibit->is_items =                1;
        $exhibit->is_context_band =         1;
        $exhibit->context_band_unit =       'hour';
        $exhibit->context_band_height =     30;
        $exhibit->h_percent =               50;
        $exhibit->v_percent =               50;
        $exhibit->map_focus =              'CENTER()';
        $exhibit->map_zoom =                1;
        $exhibit->focus_date =              'date';
        $exhibit->timeline_zoom =           10;
        $exhibit->vector_color =            '#ffffff';
        $exhibit->stroke_color =            '#ffffff';
        $exhibit->highlight_color =         '#ffffff';
        $exhibit->vector_opacity =          50;
        $exhibit->select_opacity =          50;
        $exhibit->stroke_opacity =          50;
        $exhibit->graphic_opacity =         50;
        $exhibit->stroke_width =            3;
        $exhibit->point_radius =            3;
        $exhibit->base_layer =              1;
        $exhibit->save();

        // Re-get the exhibit object.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Get.
        $this->assertNotNull($exhibit->added);
        $this->assertNotNull($exhibit->modified);
        $this->assertEquals($exhibit->query, 'query');
        $this->assertEquals($exhibit->title, 'title');
        $this->assertEquals($exhibit->description, 'Description.');
        $this->assertEquals($exhibit->slug, 'slug');
        $this->assertEquals($exhibit->public, 1);
        $this->assertEquals($exhibit->image_id, 1);
        $this->assertEquals($exhibit->top_element, 'map');
        $this->assertEquals($exhibit->items_h_pos, 'right');
        $this->assertEquals($exhibit->items_v_pos, 'top');
        $this->assertEquals($exhibit->items_height, 'full');
        $this->assertEquals($exhibit->is_map, 1);
        $this->assertEquals($exhibit->is_timeline, 1);
        $this->assertEquals($exhibit->is_items, 1);
        $this->assertEquals($exhibit->is_context_band, 1);
        $this->assertEquals($exhibit->context_band_unit, 'hour');
        $this->assertEquals($exhibit->context_band_height, 30);
        $this->assertEquals($exhibit->h_percent, 50);
        $this->assertEquals($exhibit->v_percent, 50);
        $this->assertEquals($exhibit->map_focus, 'CENTER()');
        $this->assertEquals($exhibit->map_zoom, 1);
        $this->assertEquals($exhibit->focus_date, 'date');
        $this->assertEquals($exhibit->timeline_zoom, 10);
        $this->assertEquals($exhibit->vector_color, '#ffffff');
        $this->assertEquals($exhibit->stroke_color, '#ffffff');
        $this->assertEquals($exhibit->highlight_color, '#ffffff');
        $this->assertEquals($exhibit->vector_opacity, 50);
        $this->assertEquals($exhibit->select_opacity, 50);
        $this->assertEquals($exhibit->stroke_opacity, 50);
        $this->assertEquals($exhibit->graphic_opacity, 50);
        $this->assertEquals($exhibit->stroke_width, 3);
        $this->assertEquals($exhibit->point_radius, 3);
        $this->assertEquals($exhibit->base_layer, 1);

    }

    /**
     * save() should set image_id to null if one is not passed.
     *
     * @return void.
     */
    public function testSaveFormWithoutImage()
    {
        $neatline = $this->__exhibit();
        $this->assertNull($neatline->image_id);
    }

    /**
     * When there is no map, getMap() method should return null.
     *
     * @return void.
     */
    public function testGetImageWithNullKey()
    {

        // Create an exhibit and map.
        $exhibit = $this->__exhibit();

        // Get the map and check.
        $retrievedImage = $exhibit->getImage();
        $this->assertNull($retrievedImage);

    }

    /**
     * saveForm() should save all key=>value pairs in the form data.
     *
     * @return void.
     */
    public function testSaveForm()
    {

        // Create an exhibit and map.
        $exhibit = $this->__exhibit();

        // Save form data.
        $exhibit->saveForm(array(
            'title' => 'Form Title',
            'description' => 'Form description.',
            'slug' => 'form-slug',
            'public' => 1
        ));

        // Check values.
        $this->assertEquals($exhibit->title, 'Form Title');
        $this->assertEquals($exhibit->description, 'Form description.');
        $this->assertEquals($exhibit->slug, 'form-slug');
        $this->assertEquals($exhibit->public, 1);

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
        $neatline = $this->__exhibit();
        $item = $this->__item();

        // Create a record.
        $record = new NeatlineRecord($item, $neatline);

        // Falses.
        $this->assertFalse($neatline->getRecordStatus($item, 'space'));
        $this->assertFalse($neatline->getRecordStatus($item, 'time'));
        $this->assertFalse($neatline->getRecordStatus($item, 'items'));

        // Trues.
        $record->space_active = 1;
        $record->time_active = 1;
        $record->items_active = 1;
        $record->save();
        $this->assertTrue($neatline->getRecordStatus($item, 'space'));
        $this->assertTrue($neatline->getRecordStatus($item, 'time'));
        $this->assertTrue($neatline->getRecordStatus($item, 'items'));

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
        $neatline = $this->__exhibit();
        $item = $this->__item();

        // Create a record.
        $record = new NeatlineRecord($item, $neatline);
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
        $neatline = $this->__exhibit();
        $item = $this->__item();

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
        $neatline1 = $this->__exhibit('test-exhibit-1');
        $neatline2 = $this->__exhibit('test-exhibit-2');
        $item1 = $this->__item();
        $item2 = $this->__item();

        // Create records.
        $record1 = new NeatlineRecord($item1, $neatline1);
        $record2 = new NeatlineRecord($item2, $neatline1);
        $record3 = new NeatlineRecord($item1, $neatline2);
        $record4 = new NeatlineRecord($item2, $neatline2);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // 2 exhibits, 4 data records.
        $_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $_recordsTable = $this->db->getTable('NeatlineRecord');
        $this->assertEquals($_exhibitsTable->count(), 2);
        $this->assertEquals($_recordsTable->count(), 4);

        // Call delete.
        $neatline1->delete();

        // 1 exhibits, 2 data records.
        $this->assertEquals($_exhibitsTable->count(), 1);
        $this->assertEquals($_recordsTable->count(), 2);

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
        $exhibit = $this->__exhibit();

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
        $this->assertEquals($exhibit->vector_color, '#ffffff');
        $this->assertEquals($exhibit->vector_opacity, 5);
        $this->assertEquals($exhibit->stroke_color, '#ffffff');
        $this->assertEquals($exhibit->stroke_opacity, 5);
        $this->assertEquals($exhibit->stroke_width, 5);
        $this->assertEquals($exhibit->point_radius, 5);

    }

    /**
     * setStyle() should not save a row value if the passed value is the
     * same as the system default and there is not a non-null row value.
     *
     * @return void.
     */
    public function testSetStyleWithNonNovelDuplicateValuesAndUnsetRowValues()
    {

        // Create a record.
        $exhibit = $this->__exhibit();

        // Set.
        $this->assertFalse($exhibit->setStyle('vector_color', get_plugin_ini('Neatline', 'vector_color')));
        $this->assertFalse($exhibit->setStyle('vector_opacity', get_plugin_ini('Neatline', 'vector_opacity')));
        $this->assertFalse($exhibit->setStyle('stroke_color', get_plugin_ini('Neatline', 'stroke_color')));
        $this->assertFalse($exhibit->setStyle('stroke_opacity', get_plugin_ini('Neatline', 'stroke_opacity')));
        $this->assertFalse($exhibit->setStyle('stroke_width', get_plugin_ini('Neatline', 'stroke_width')));
        $this->assertFalse($exhibit->setStyle('point_radius', get_plugin_ini('Neatline', 'point_radius')));

        // Check.
        $this->assertNull($exhibit->vector_color);
        $this->assertNull($exhibit->vector_opacity);
        $this->assertNull($exhibit->stroke_color);
        $this->assertNull($exhibit->stroke_opacity);
        $this->assertNull($exhibit->stroke_width);
        $this->assertNull($exhibit->point_radius);

    }

    /**
     * setStyle() should null a row-level value when the passed value is the same
     * as the system default and there is a non-null existing row value.
     *
     * @return void.
     */
    public function testSetStyleWithNonNovelDuplicateValuesAndSetRowValues()
    {

        // Create a record.
        $exhibit = $this->__exhibit();
        $exhibit->vector_color = '#000000';
        $exhibit->stroke_color = '#000000';
        $exhibit->vector_opacity = 1;
        $exhibit->stroke_opacity = 1;
        $exhibit->stroke_width = 1;
        $exhibit->point_radius = 1;
        $exhibit->save();

        // Set.
        $this->assertTrue($exhibit->setStyle('vector_color', get_plugin_ini('Neatline', 'vector_color')));
        $this->assertTrue($exhibit->setStyle('vector_opacity', get_plugin_ini('Neatline', 'vector_opacity')));
        $this->assertTrue($exhibit->setStyle('stroke_color', get_plugin_ini('Neatline', 'stroke_color')));
        $this->assertTrue($exhibit->setStyle('stroke_opacity', get_plugin_ini('Neatline', 'stroke_opacity')));
        $this->assertTrue($exhibit->setStyle('stroke_width', get_plugin_ini('Neatline', 'stroke_width')));
        $this->assertTrue($exhibit->setStyle('point_radius', get_plugin_ini('Neatline', 'point_radius')));

        // Check.
        $this->assertNull($exhibit->vector_color);
        $this->assertNull($exhibit->stroke_color);
        $this->assertNull($exhibit->vector_opacity);
        $this->assertNull($exhibit->stroke_opacity);
        $this->assertNull($exhibit->stroke_width);
        $this->assertNull($exhibit->point_radius);

    }

    /**
     * setBaseLayerByName() should set the base_layer column with the
     * id of the base layer record with the passed name when there is a layer
     * with the passed name.
     *
     * @return void.
     */
    public function testSetBaseLayerByNameWithLayer()
    {

        // Create a record.
        $exhibit = $this->__exhibit();

        // Create a base layer.
        $layer = new NeatlineLayer();
        $layer->name = 'Test Layer';
        $layer->save();

        $exhibit->setBaseLayerByName('Test Layer');
        $this->assertEquals($exhibit->base_layer, $layer->id);

    }

    /**
     * When there is no layer with the passed name, setBaseLayerByName() should
     * not change base_layer.
     *
     * @return void.
     */
    public function testSetBaseLayerByNameWithNoLayer()
    {

        // Create a record.
        $exhibit = $this->__exhibit();

        // Capture staring layer, try to se non-existent.
        $originalBaseLayer = $exhibit->base_layer;
        $exhibit->setBaseLayerByName('Test Layer');
        $this->assertEquals($originalBaseLayer, $exhibit->base_layer);

    }

    /**
     * getStyle() should return the exhibit-specific default when one exists.
     *
     * @return void.
     */
    public function testGetStyleWithExhibitDefaults()
    {

        // Create a record.
        $exhibit = $this->__exhibit();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Set exhibit defaults.
        $exhibit->vector_color = '#ffffff';
        $exhibit->stroke_color = '#ffffff';
        $exhibit->vector_opacity = 5;
        $exhibit->stroke_opacity = 5;
        $exhibit->stroke_width = 5;
        $exhibit->point_radius = 5;

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
        $exhibit = $this->__exhibit();

        // Set system styling defaults.
        set_option('vector_color', '#5033de');
        set_option('stroke_color', '#1e2ee6');
        set_option('vector_opacity', 20);
        set_option('stroke_opacity', 70);
        set_option('stroke_width', 4);
        set_option('point_radius', 6);

        // Check.
        $this->assertEquals(
            $exhibit->getStyle('vector_color'),
            get_plugin_ini('Neatline', 'vector_color'));
        $this->assertEquals(
            $exhibit->getStyle('vector_opacity'),
            get_plugin_ini('Neatline', 'vector_opacity'));
        $this->assertEquals(
            $exhibit->getStyle('stroke_color'),
            get_plugin_ini('Neatline', 'stroke_color'));
        $this->assertEquals(
            $exhibit->getStyle('stroke_opacity'),
            get_plugin_ini('Neatline', 'stroke_opacity'));
        $this->assertEquals(
            $exhibit->getStyle('stroke_width'),
            get_plugin_ini('Neatline', 'stroke_width'));
        $this->assertEquals(
            $exhibit->getStyle('point_radius'),
            get_plugin_ini('Neatline', 'point_radius'));

    }

    /**
     * getNumberOfRecords() should return 0 when there are no records.
     *
     * @return void.
     */
    public function testGetNumberOfRecordsWhenNoRecordsExist()
    {

        // Create exhibits.
        $neatline = $this->__exhibit();

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
        $neatline1 = $this->__exhibit('test-exhibit-1');
        $neatline2 = $this->__exhibit('test-exhibit-2');

        // Create records.
        $record1 = new NeatlineRecord(null, $neatline1);
        $record2 = new NeatlineRecord(null, $neatline1);
        $record3 = new NeatlineRecord(null, $neatline1);
        $record4 = new NeatlineRecord(null, $neatline2);
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
     * getBaseLayer() should return the default layer when there is no
     * local default setting.
     *
     * @return void.
     */
    public function testGetBaseLayerWithNoLocalSetting()
    {

        // Create exhibit.
        $neatline = $this->__exhibit();

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
        $neatline = $this->__exhibit();
        $layer = new NeatlineLayer;
        $layer->name = 'Test Layer';
        $layer->save();

        // Set key.
        $neatline->base_layer = $layer->id;
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

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Test for system defaults.
        $this->assertEquals(
            $exhibit->getViewportProportions(),
            array(
                'horizontal' => get_plugin_ini('Neatline', 'h_percent'),
                'vertical' => get_plugin_ini('Neatline', 'v_percent')
            )
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

        // Create exhibit and set local values.
        $exhibit = $this->__exhibit();
        $exhibit->h_percent = 10;
        $exhibit->v_percent = 20;

        // Test for system defaults.
        $this->assertEquals(
            $exhibit->getViewportProportions(),
            array('horizontal' => 10, 'vertical' => 20)
        );

    }

    /**
     * getTimelineZoom() should return system default when there is no
     * set value on the exhibit record.
     *
     * @return void.
     */
    public function testGetTimelineZoomWithNoLocalSettings()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Test for system default.
        $this->assertEquals(
            $exhibit->getTimelineZoom(),
            get_plugin_ini('Neatline', 'timeline_zoom')
        );

    }

    /**
     * getTimelineZoom() should return the record specific setting when
     * there are local values on the row.
     *
     * @return void.
     */
    public function testGetTimelineZoomWithLocalSettings()
    {

        // Set system default.
        set_option('timeline_zoom', 25);

        // Create exhibit.
        $exhibit = $this->__exhibit();
        $exhibit->timeline_zoom = 3;

        // Test for system default.
        $this->assertEquals(
            $exhibit->getTimelineZoom(),
            3
        );

    }

}
