<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Data row record tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest extends Neatline_Test_AppTestCase
{

    /**
     * Test get and set on columns.
     *
     * @return void.
     */
    public function testAttributeAccess()
    {

        // Create a record.
        $item = $this->__item();
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord($item, $neatline);

        // Set.
        $record->title              = 'title';
        $record->description        = 'description';
        $record->vector_color       = '#ffffff';
        $record->stroke_color       = '#ffffff';
        $record->select_color       = '#ffffff';
        $record->vector_opacity     = 50;
        $record->select_opacity     = 50;
        $record->stroke_opacity     = 50;
        $record->graphic_opacity    = 50;
        $record->stroke_width       = 3;
        $record->point_radius       = 3;
        $record->point_image        = 'http://test.org';
        $record->coverage           = 'POINT()';
        $record->map_active         = 1;
        $record->map_focus          = 'CENTER()';
        $record->map_zoom           = 5;
        $record->save();

        // Re-get the record object.
        $record = $this->_recordsTable->find($record->id);

        // Get.
        $this->assertEquals($record->title, 'title');
        $this->assertEquals($record->description, 'description');
        $this->assertEquals($record->vector_color, '#ffffff');
        $this->assertEquals($record->stroke_color, '#ffffff');
        $this->assertEquals($record->select_color, '#ffffff');
        $this->assertEquals($record->vector_opacity, 50);
        $this->assertEquals($record->select_opacity, 50);
        $this->assertEquals($record->stroke_opacity, 50);
        $this->assertEquals($record->graphic_opacity, 50);
        $this->assertEquals($record->stroke_width, 3);
        $this->assertEquals($record->point_radius, 3);
        $this->assertEquals($record->point_image, 'http://test.org');
        $this->assertEquals($record->coverage, 'POINT()');
        $this->assertEquals($record->map_active, 1);
        $this->assertEquals($record->map_focus, 'CENTER()');
        $this->assertEquals($record->map_zoom, 5);

    }

    /**
     * __construct() should set foreign keys.
     *
     * @return void.
     */
    public function testAttributeDefaults()
    {

        // Create a record.
        $item = $this->__item();
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord($item, $neatline);

        // Item and exhibit keys should be set.
        $this->assertEquals($record->exhibit_id, $neatline->id);
        $this->assertEquals($record->item_id, $item->id);

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
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord(null, $neatline);

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
        $neatline = $this->__exhibit();
        $item = $this->__item();
        $record = new NeatlineRecord($item, $neatline);

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
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord(null, $neatline);

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
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord(null, $neatline);

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
        $record = $this->__record();

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
        $record = $this->__record();

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
        $item = $this->__item();

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create two records.
        $record1 = new NeatlineRecord($item, $exhibit);
        $record1->save();
        $record2 = new NeatlineRecord($item, $exhibit);
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
     * The resetStyles() method should null out all style parameters.
     *
     * @return void.
     */
    public function testResetStyles()
    {

        // Create an item, exhibit, and record.
        $item = $this->__item();
        $neatline = $this->__exhibit();
        $record = new NeatlineRecord($item, $neatline);

        // Set styles.
        $record->vector_color = '#ffffff';
        $record->stroke_color = '#ffffff';
        $record->select_color = '#ffffff';
        $record->vector_opacity = 50;
        $record->stroke_opacity = 50;
        $record->graphic_opacity = 50;
        $record->stroke_width = 50;
        $record->point_radius = 50;
        $record->point_image = '/path';

        // Reset.
        $record->resetStyles();

        // Check.
        $this->assertNull($record->vector_color);
        $this->assertNull($record->stroke_color);
        $this->assertNull($record->select_color);
        $this->assertNull($record->vector_opacity);
        $this->assertNull($record->stroke_opacity);
        $this->assertNull($record->graphic_opacity);
        $this->assertNull($record->stroke_width);
        $this->assertNull($record->point_radius);
        $this->assertNull($record->point_image);

    }

    /**
     * update() should update all non-empty properties.
     *
     * @return void
     **/
    public function testUpdate()
    {

        // Create record.
        $exhibit = $this->__exhibit();
        $record = $this->__record();

        // Set parameters.
        $record->title              = 'title';
        $record->description        = 'desc';
        $record->slug               = 'slug';
        $record->vector_color       = '#vector';
        $record->stroke_color       = '#stroke';
        $record->select_color       = '#select';
        $record->vector_opacity     = 1;
        $record->select_opacity     = 2;
        $record->stroke_opacity     = 3;
        $record->graphic_opacity    = 4;
        $record->stroke_width       = 5;
        $record->point_radius       = 6;
        $record->point_image        = 'file.png';
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 7;
        $record->coverage           = 'kml';
        $record->map_active         = 1;

        // Mock values.
        $values = array(
            'id'                    => (string) $record->id,
            'item_id'               => null,
            'title'                 => 'title2',
            'description'           => 'desc2',
            'slug'                  => 'slug2',
            'vector_color'          => '#vector2',
            'stroke_color'          => '#stroke2',
            'select_color'          => '#select2',
            'vector_opacity'        => '10',
            'select_opacity'        => '20',
            'stroke_opacity'        => '30',
            'graphic_opacity'       => '40',
            'stroke_width'          => '50',
            'point_radius'          => '60',
            'point_image'           => 'file2.png',
            'map_focus'             => 'lat2/lon2',
            'map_zoom'              => '70',
            'coverage'              => 'kml2',
            'bounds'                => 'POLYGON((0 0,0 1,1 1,1 0,0 0))',
            'map_active'            => '0'
        );

        // Update, reget record.
        $record->update($values);
        $record = $this->_recordsTable->find($record->id);

        // Check new values.
        $this->assertEquals($record->title, 'title2');
        $this->assertEquals($record->description, 'desc2');
        $this->assertEquals($record->slug, 'slug2');
        $this->assertEquals($record->vector_color, '#vector2');
        $this->assertEquals($record->stroke_color, '#stroke2');
        $this->assertEquals($record->select_color, '#select2');
        $this->assertEquals($record->vector_opacity, 10);
        $this->assertEquals($record->select_opacity, 20);
        $this->assertEquals($record->stroke_opacity, 30);
        $this->assertEquals($record->graphic_opacity, 40);
        $this->assertEquals($record->stroke_width, 50);
        $this->assertEquals($record->point_radius, 60);
        $this->assertEquals($record->point_image, 'file2.png');
        $this->assertEquals($record->map_focus, 'lat2/lon2');
        $this->assertEquals($record->map_zoom, 70);
        $this->assertEquals($record->coverage, 'kml2');
        $this->assertEquals($record->map_active, 0);

    }

    /**
     * save() should update the modified field on the parent exhibit.
     *
     * @return void.
     */
    public function testUpdateExhibitModifiedOnSave()
    {

        // Get time.
        $timestamp = date('Y-m-d H:i:s');

        // Set the modified date back, get delta and check.
        $exhibit = $this->__exhibit();
        $exhibit->modified = '2010-01-01 00:00:00';
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertGreaterThanOrEqual(1, $delta);

        // Create a record and save.
        $record = new NeatlineRecord(null, $exhibit);
        $record->save();

        // Reget the record.
        $exhibit = $record->getExhibit();

        // Get delta and check.
        $delta = strtotime($timestamp) - strtotime($exhibit->modified);
        $this->assertLessThanOrEqual(1, $delta);

    }

    /**
     * buildJsonData() should construct a well-formed array object with
     * all attributes necessary for the front-end application.
     *
     * @return void.
     */
    public function testBuildJsonData()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord(null, $exhibit);

        // Text.
        $record->title                  = 'Title';
        $record->description            = 'Description.';
        $record->slug                   = 'slug';

        // Styles.
        $record->vector_color           = '#1';
        $record->stroke_color           = '#2';
        $record->select_color           = '#3';
        $record->vector_opacity         = 1;
        $record->select_opacity         = 2;
        $record->stroke_opacity         = 3;
        $record->graphic_opacity        = 4;
        $record->stroke_width           = 5;
        $record->point_radius           = 6;
        $record->point_image            = 'file.png';

        // Map.
        $record->map_focus              = 'lat/lon';
        $record->coverage               = 'kml';
        $record->map_zoom               = 10;

        // Statuses.
        $record->map_active             = 1;

        $record->save();

        // Ping the method for the json.
        $data = $record->buildJsonData();

        $this->assertEquals(
            $data,
            array(

                'id'                    => $record->id,
                'item_id'               => $record->item_id,

                // Text.
                'title'                 => 'Title',
                'description'           => 'Description.',
                'slug'                  => 'slug',

                // Styles.
                'vector_color'          => '#1',
                'stroke_color'          => '#2',
                'select_color'          => '#3',
                'vector_opacity'        => 1,
                'select_opacity'        => 2,
                'stroke_opacity'        => 3,
                'graphic_opacity'       => 4,
                'stroke_width'          => 5,
                'point_radius'          => 6,
                'point_image'           => 'file.png',

                // Map.
                'map_focus'             => 'lat/lon',
                'map_zoom'              => 10,
                'coverage'              => 'kml',
                'wmsAddress'            => null,
                'layers'                => null,

                // Statuses.
                'map_active'            => 1

            )
        );

    }

}
