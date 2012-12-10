<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `update()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Update
    extends Neatline_Test_AppTestCase
{


    /**
     * update() should directly set all non-style values.
     *
     * @group tags
     */
    public function testUpdateNonStyleValues()
    {

        // Create record.
        $record = $this->__record();

        // Set:
        $record->slug               = 'slug';
        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tag1,tag2';
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 1;
        $record->map_active         = 2;

        // Mock values.
        $values = array(

            // Local values:
            // -------------

            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug2',
            'title'                 => 'title2',
            'body'                  => 'body2',
            'tags'                  => 'tag3,tag4',
            'map_focus'             => 'lat2/lon2',
            'coverage'              => 'POINT(1 1)',
            'map_zoom'              => 2,
            'map_active'            => 0,

            // Un-set local styles:
            // --------------------

            'vector_color'          => null,
            'stroke_color'          => null,
            'select_color'          => null,
            'vector_opacity'        => null,
            'select_opacity'        => null,
            'stroke_opacity'        => null,
            'image_opacity'         => null,
            'stroke_width'          => null,
            'point_radius'          => null,
            'point_image'           => null,
            'max_zoom'              => null,
            'min_zoom'              => null

        );

        // Update, get record.
        $record->update($values);
        $record = $this->_recordsTable->find($record->id);

        // Check new values.
        $this->assertEquals($record->slug, 'slug2');
        $this->assertEquals($record->title, 'title2');
        $this->assertEquals($record->body, 'body2');
        $this->assertEquals($record->tags, 'tag3,tag4');
        $this->assertEquals($record->map_focus, 'lat2/lon2');
        $this->assertEquals($record->map_zoom, 2);
        $this->assertEquals($record->map_active, 0);
        $this->assertNotNull($record->coverage);

    }


    /**
     * When non-null style values are passed to update() and the record
     * does not have an existing record-specific tag, a new tag should be
     * created and populated with values.
     *
     * @group tags
     */
    public function testUpdateCreateLocalTag()
    {

        // Create record.
        $record = $this->__record();

        // Mock values.
        $values = array(

            // Local values:
            // -------------

            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug',
            'title'                 => 'title',
            'body'                  => 'body',
            'tags'                  => 'tag1,tag2',
            'coverage'              => 'POINT(1 1)',
            'map_active'            => 1,
            'map_focus'             => 'lat/lon',
            'map_zoom'              => 2,

            // Locally-set styles:
            // -------------------

            'vector_color'          => '#333333',
            'stroke_color'          => '#444444',
            'select_color'          => '#555555',
            'vector_opacity'        => 6,
            'select_opacity'        => 7,
            'stroke_opacity'        => 8,
            'image_opacity'         => 9,
            'stroke_width'          => 10,
            'point_radius'          => 11,
            'point_image'           => 'file.png',
            'max_zoom'              => 12,
            'min_zoom'              => 13,

        );

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Update.
        $record->update($values);

        // Check tags+1.
        $this->assertEquals($startCount+1, $this->_tagsTable->count());

        // Check new tag.
        $tag = $this->getLastTag();
        $this->assertEquals($record->tag_id,        $tag->id);
        $this->assertEquals($tag->vector_color,      '#333333');
        $this->assertEquals($tag->stroke_color,      '#444444');
        $this->assertEquals($tag->select_color,      '#555555');
        $this->assertEquals($tag->vector_opacity,    6);
        $this->assertEquals($tag->select_opacity,    7);
        $this->assertEquals($tag->stroke_opacity,    8);
        $this->assertEquals($tag->image_opacity,     9);
        $this->assertEquals($tag->stroke_width,      10);
        $this->assertEquals($tag->point_radius,      11);
        $this->assertEquals($tag->point_image,       'file.png');
        $this->assertEquals($tag->max_zoom,          12);
        $this->assertEquals($tag->min_zoom,          13);

    }


    /**
     * When non-null style values are passed to update() and the record
     * already has a record-specific tag, the tag should be updated with
     * the new values.
     *
     * @group tags
     */
    public function testUpdateUpdateLocalTag()
    {

        // Create record.
        $record = $this->__record();

        // Create tag.
        $tag = new NeatlineTag;
        $tag->vector_color =    '#111111';
        $tag->stroke_color =    '#222222';
        $tag->select_color =    '#333333';
        $tag->vector_opacity =  4;
        $tag->select_opacity =  5;
        $tag->stroke_opacity =  6;
        $tag->image_opacity =   7;
        $tag->stroke_width =    8;
        $tag->point_radius =    9;
        $tag->point_image =     'file.png';
        $tag->max_zoom =        10;
        $tag->min_zoom =        11;
        $tag->save();

        // Set tag reference.
        $record->tag_id = $tag->id;

        // Mock new values.
        $values = array(

            // Local values:
            // -------------

            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug',
            'title'                 => 'title',
            'body'                  => 'body',
            'tags'                  => 'tag1,tag2',
            'coverage'              => 'POINT(1 1)',
            'map_active'            => 1,
            'map_focus'             => 'lat/lon',
            'map_zoom'              => 2,

            // Locally-set styles:
            // -------------------

            'vector_color'          => '#222222',
            'stroke_color'          => '#333333',
            'select_color'          => '#444444',
            'vector_opacity'        => 5,
            'select_opacity'        => 6,
            'stroke_opacity'        => 7,
            'image_opacity'         => 8,
            'stroke_width'          => 9,
            'point_radius'          => 10,
            'point_image'           => 'file2.png',
            'max_zoom'              => 11,
            'min_zoom'              => 12,

        );

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Update.
        $record->update($values);

        // Check tags+0.
        $this->assertEquals($startCount, $this->_tagsTable->count());

        // Check updated tag.
        $tag = $this->_tagsTable->find($tag->id);
        $this->assertEquals($tag->vector_color,      '#222222');
        $this->assertEquals($tag->stroke_color,      '#333333');
        $this->assertEquals($tag->select_color,      '#444444');
        $this->assertEquals($tag->vector_opacity,    5);
        $this->assertEquals($tag->select_opacity,    6);
        $this->assertEquals($tag->stroke_opacity,    7);
        $this->assertEquals($tag->image_opacity,     8);
        $this->assertEquals($tag->stroke_width,      9);
        $this->assertEquals($tag->point_radius,      10);
        $this->assertEquals($tag->point_image,       'file2.png');
        $this->assertEquals($tag->max_zoom,          11);
        $this->assertEquals($tag->min_zoom,          12);

    }


    /**
     * When a record-specific tag is updated, fields that had been set to
     * non-null values in the past but have now been "deactivated" in the
     * form should be set back to null on the tag.
     *
     * @group tags
     */
    public function testUpdateUpdateLocalTagNullValues()
    {

        // Create record.
        $record = $this->__record();

        // Create tag.
        $tag = new NeatlineTag;
        $tag->vector_color =    '#111111';
        $tag->stroke_color =    '#222222';
        $tag->select_color =    '#333333';
        $tag->vector_opacity =  4;
        $tag->select_opacity =  5;
        $tag->stroke_opacity =  6;
        $tag->image_opacity =   7;
        $tag->stroke_width =    8;
        $tag->point_radius =    9;
        $tag->point_image =     'file.png';
        $tag->max_zoom =        10;
        $tag->min_zoom =        11;
        $tag->save();

        // Set tag reference.
        $record->tag_id = $tag->id;

        // Mock new values.
        $values = array(

            // Local values:
            // -------------

            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug',
            'title'                 => 'title',
            'body'                  => 'body',
            'tags'                  => 'tag1,tag2',
            'coverage'              => 'POINT(1 1)',
            'map_active'            => 1,
            'map_focus'             => 'lat/lon',
            'map_zoom'              => 2,

            // Locally-set styles:
            // -------------------

            'vector_color'          => '#222222',
            'stroke_color'          => null,
            'select_color'          => '#444444',
            'vector_opacity'        => null,
            'select_opacity'        => 6,
            'stroke_opacity'        => null,
            'image_opacity'         => 8,
            'stroke_width'          => null,
            'point_radius'          => 10,
            'point_image'           => null,
            'max_zoom'              => 11,
            'min_zoom'              => null,

        );

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Update.
        $record->update($values);

        // Check tags+0.
        $this->assertEquals($startCount, $this->_tagsTable->count());

        // Check updated tag.
        $tag = $this->_tagsTable->find($tag->id);
        $this->assertEquals($tag->vector_color,      '#222222');
        $this->assertNull($tag->stroke_color);
        $this->assertEquals($tag->select_color,      '#444444');
        $this->assertNull($tag->vector_opacity);
        $this->assertEquals($tag->select_opacity,    6);
        $this->assertNull($tag->stroke_opacity);
        $this->assertEquals($tag->image_opacity,     8);
        $this->assertNull($tag->stroke_width);
        $this->assertEquals($tag->point_radius,      10);
        $this->assertNull($tag->point_image);
        $this->assertEquals($tag->max_zoom,          11);
        $this->assertNull($tag->min_zoom);

    }


    /**
     * When a record that has a record-specific tag from previous updates
     * is updated with all-null local style values, the existing local tag
     * is no longer needed and should be removed and the `tag_id` on the
     * record should be set to null.
     *
     * @group tags
     */
    public function testUpdateLocalTagGarbageCollection()
    {

        // Create record.
        $record = $this->__record();

        // Create tag.
        $tag = new NeatlineTag;
        $tag->vector_color =    '#111111';
        $tag->stroke_color =    '#222222';
        $tag->select_color =    '#333333';
        $tag->vector_opacity =  4;
        $tag->select_opacity =  5;
        $tag->stroke_opacity =  6;
        $tag->image_opacity =   7;
        $tag->stroke_width =    8;
        $tag->point_radius =    9;
        $tag->point_image =     'file.png';
        $tag->max_zoom =        10;
        $tag->min_zoom =        11;
        $tag->save();

        // Set tag reference.
        $record->tag_id = $tag->id;

        // Mock new values.
        $values = array(

            // Local values:
            // -------------

            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug',
            'title'                 => 'title',
            'body'                  => 'body',
            'tags'                  => 'tag1,tag2',
            'coverage'              => 'POINT(1 1)',
            'map_active'            => 1,
            'map_focus'             => 'lat/lon',
            'map_zoom'              => 2,

            // Locally-set styles:
            // -------------------

            'vector_color'          => null,
            'stroke_color'          => null,
            'select_color'          => null,
            'vector_opacity'        => null,
            'select_opacity'        => null,
            'stroke_opacity'        => null,
            'image_opacity'         => null,
            'stroke_width'          => null,
            'point_radius'          => null,
            'point_image'           => null,
            'max_zoom'              => null,
            'min_zoom'              => null,

        );

        // Starting tags count.
        $startCount = $this->_tagsTable->count();

        // Update.
        $record->update($values);

        // Check tags-1.
        $this->assertEquals($startCount-1, $this->_tagsTable->count());
        $this->assertNull($this->_tagsTable->find($tag->id));

        // Re-get the record, check for null `tag_id`.
        $record = $this->_recordsTable->find($record->id);
        $this->assertNull($record->tag_id);

    }


    /**
     * When a record is updated, the tags string should be used to update
     * all of the style tag references to point to the first tag in the
     * depth chart for which the field in question is defined.
     *
     * @group tags
     */
    public function testUpdateTagReferences()
    {

        // Create record.
        $record = $this->__record();

        // Create 12 tags, each with one more defined field than the last.
        // ---------------------------------------------------------------

        $tag1 = new NeatlineTag;
        $tag1->vector_color =    '#1';
        $tag1->save();

        $tag2 = new NeatlineTag;
        $tag2->vector_color =    '#2';
        $tag2->stroke_color =    '#3';
        $tag2->save();

        $tag3 = new NeatlineTag;
        $tag3->vector_color =    '#4';
        $tag3->stroke_color =    '#5';
        $tag3->select_color =    '#6';
        $tag3->save();

        $tag4 = new NeatlineTag;
        $tag4->vector_color =    '#7';
        $tag4->stroke_color =    '#8';
        $tag4->select_color =    '#9';
        $tag4->vector_opacity =  10;
        $tag4->save();

        $tag5 = new NeatlineTag;
        $tag5->vector_color =    '#11';
        $tag5->stroke_color =    '#12';
        $tag5->select_color =    '#13';
        $tag5->vector_opacity =  14;
        $tag5->select_opacity =  15;
        $tag5->save();

        $tag6 = new NeatlineTag;
        $tag6->vector_color =    '#16';
        $tag6->stroke_color =    '#17';
        $tag6->select_color =    '#18';
        $tag6->vector_opacity =  19;
        $tag6->select_opacity =  20;
        $tag6->stroke_opacity =  21;
        $tag6->save();

        $tag7 = new NeatlineTag;
        $tag7->vector_color =    '#22';
        $tag7->stroke_color =    '#23';
        $tag7->select_color =    '#24';
        $tag7->vector_opacity =  25;
        $tag7->select_opacity =  26;
        $tag7->stroke_opacity =  27;
        $tag7->image_opacity =   28;
        $tag7->save();

        $tag8 = new NeatlineTag;
        $tag8->vector_color =    '#29';
        $tag8->stroke_color =    '#30';
        $tag8->select_color =    '#31';
        $tag8->vector_opacity =  32;
        $tag8->select_opacity =  33;
        $tag8->stroke_opacity =  34;
        $tag8->image_opacity =   35;
        $tag8->stroke_width =    36;
        $tag8->save();

        $tag9 = new NeatlineTag;
        $tag9->vector_color =    '#37';
        $tag9->stroke_color =    '#38';
        $tag9->select_color =    '#39';
        $tag9->vector_opacity =  40;
        $tag9->select_opacity =  41;
        $tag9->stroke_opacity =  42;
        $tag9->image_opacity =   43;
        $tag9->stroke_width =    44;
        $tag9->point_radius =    45;
        $tag9->save();

        $tag10 = new NeatlineTag;
        $tag10->vector_color =    '#37';
        $tag10->stroke_color =    '#38';
        $tag10->select_color =    '#39';
        $tag10->vector_opacity =  40;
        $tag10->select_opacity =  41;
        $tag10->stroke_opacity =  42;
        $tag10->image_opacity =   43;
        $tag10->stroke_width =    44;
        $tag10->point_radius =    45;
        $tag10->point_image =     '46.png';
        $tag10->save();

        $tag11 = new NeatlineTag;
        $tag11->vector_color =    '#47';
        $tag11->stroke_color =    '#48';
        $tag11->select_color =    '#49';
        $tag11->vector_opacity =  50;
        $tag11->select_opacity =  51;
        $tag11->stroke_opacity =  52;
        $tag11->image_opacity =   53;
        $tag11->stroke_width =    54;
        $tag11->point_radius =    55;
        $tag11->point_image =     '56.png';
        $tag11->save();

        $tag12 = new NeatlineTag;
        $tag12->vector_color =    '#57';
        $tag12->stroke_color =    '#58';
        $tag12->select_color =    '#59';
        $tag12->vector_opacity =  60;
        $tag12->select_opacity =  61;
        $tag12->stroke_opacity =  62;
        $tag12->image_opacity =   63;
        $tag12->stroke_width =    64;
        $tag12->point_radius =    65;
        $tag12->point_image =     '66.png';
        $tag12->max_zoom =        67;
        $tag12->save();

        $tag13 = new NeatlineTag;
        $tag13->vector_color =    '#68';
        $tag13->stroke_color =    '#69';
        $tag13->select_color =    '#70';
        $tag13->vector_opacity =  71;
        $tag13->select_opacity =  72;
        $tag13->stroke_opacity =  73;
        $tag13->image_opacity =   74;
        $tag13->stroke_width =    75;
        $tag13->point_radius =    76;
        $tag13->point_image =     '77.png';
        $tag13->max_zoom =        78;
        $tag13->min_zoom =        79;
        $tag13->save();


        // // Set tag reference.
        // $record->tag_id = $tag->id;

        // // Mock new values.
        // $values = array(

        //     // Local values:
        //     // -------------

        //     'id'                    => $record->id,
        //     'item_id'               => null,
        //     'slug'                  => 'slug',
        //     'title'                 => 'title',
        //     'body'                  => 'body',
        //     'tags'                  => 'tag1,tag2',
        //     'coverage'              => 'POINT(1 1)',
        //     'map_active'            => 1,
        //     'map_focus'             => 'lat/lon',
        //     'map_zoom'              => 2,

        //     // Locally-set styles:
        //     // -------------------

        //     'vector_color'          => null,
        //     'stroke_color'          => null,
        //     'select_color'          => null,
        //     'vector_opacity'        => null,
        //     'select_opacity'        => null,
        //     'stroke_opacity'        => null,
        //     'image_opacity'         => null,
        //     'stroke_width'          => null,
        //     'point_radius'          => null,
        //     'point_image'           => null,
        //     'max_zoom'              => null,
        //     'min_zoom'              => null,

        // );

        // // Starting tags count.
        // $startCount = $this->_tagsTable->count();

        // // Update.
        // $record->update($values);

        // // Check tags-1.
        // $this->assertEquals($startCount-1, $this->_tagsTable->count());
        // $this->assertNull($this->_tagsTable->find($tag->id));

        // // Re-get the record, check for null `tag_id`.
        // $record = $this->_recordsTable->find($record->id);
        // $this->assertNull($record->tag_id);

    }


}
