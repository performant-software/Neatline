<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generation routines.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_FixtureBuilderTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * Record collection JSON (GET response):
     *
     * `records.standard.json`
     * `records.changed.json`
     * `records.removed.json`
     */
    public function testRecordsJson()
    {

        // Exhibit and records.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);
        $record3 = $this->__record($exhibit);


        // *** Case 1 ***
        // - #1 and #2 are map-active, #3 map-inactive.
        // - #1 has a default map focus/zoom, #2 and #3 do not.

        $record1->title             = 'title1';
        $record2->title             = 'title2';
        $record3->title             = 'title3';
        $record1->body              = 'body1';
        $record2->body              = 'body2';
        $record3->body              = 'body3';
        $record1->tags              = 'tags1';
        $record2->tags              = 'tags2';
        $record3->tags              = 'tags3';
        $record1->coverage          = 'POINT(1 2)';
        $record2->coverage          = 'POINT(3 4)';
        $record3->coverage          = 'POINT(5 6)';
        $record1->map_focus         = '100,200';
        $record1->map_zoom          = 10;
        $record1->map_active        = 1;
        $record2->map_active        = 1;
        $record3->map_active        = 0;
        $record1->vector_color      = '#111111';
        $record2->vector_color      = '#222222';
        $record3->vector_color      = '#333333';
        $record1->stroke_color      = '#444444';
        $record2->stroke_color      = '#555555';
        $record3->stroke_color      = '#666666';
        $record1->select_color      = '#777777';
        $record2->select_color      = '#888888';
        $record3->select_color      = '#999999';
        $record1->vector_opacity    = 1;
        $record2->vector_opacity    = 2;
        $record3->vector_opacity    = 3;
        $record1->select_opacity    = 4;
        $record2->select_opacity    = 5;
        $record3->select_opacity    = 6;
        $record1->stroke_opacity    = 7;
        $record2->stroke_opacity    = 8;
        $record3->stroke_opacity    = 9;
        $record1->image_opacity     = 10;
        $record2->image_opacity     = 11;
        $record3->image_opacity     = 12;
        $record1->stroke_width      = 13;
        $record2->stroke_width      = 14;
        $record3->stroke_width      = 15;
        $record1->point_radius      = 16;
        $record2->point_radius      = 17;
        $record3->point_radius      = 18;
        $record1->min_zoom          = 19;
        $record2->min_zoom          = 20;
        $record3->min_zoom          = 21;
        $record1->max_zoom          = 22;
        $record2->max_zoom          = 23;
        $record3->max_zoom          = 24;

        $record1->point_image = 'https://www.google.com/favicon.ico';
        $record2->point_image = 'http://en.wikipedia.org/favicon.ico';
        $record3->point_image = 'http://www.amazon.com/favicon.ico';

        $record1->save();
        $record2->save();
        $record3->save();

        // Write the fixture.
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.standard.json');


        // *** Case 2 ***
        // Coverage data for #2 has changed.

        $record2->coverage = 'POINT(7 8)';
        $record2->save();

        // Write the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.changed.json');


        // *** Case 3 ***
        // #2 has been deleted from the collection.

        $record2->delete();

        // Write the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.removed.json');

    }


    /**
     * Tag collection JSON (GET response):
     *
     * `tags.standard.json`
     */
    public function testTagsJson()
    {

        // Exhibit and tags.
        $exhibit = $this->__exhibit();
        $tag1 = $this->__tag($exhibit, 'tag1', true);
        $tag1 = $this->__tag($exhibit, 'tag2', true);
        $tag1 = $this->__tag($exhibit, 'tag3', true);

        // Write the fixture.
        $this->writeFixture('neatline/tags/'.$exhibit->id,
            'tags.standard.json');

    }


    /**
     * JSON for individual records (GET response):
     *
     * `record.standard.json`
     * `record.inactive.json`
     */
    public function testRecordJson()
    {

        // Exhibit and record.
        $exhibit = $this->__exhibit();
        $record = $this->__record($exhibit);

        $record->title          = 'title4';
        $record->body           = 'body4';
        $record->coverage       = 'POINT(6 7)';
        $record->map_active     = 1;
        $record->map_focus      = '100,200';
        $record->map_zoom       = 10;
        $record->vector_color   = '#111111';
        $record->stroke_color   = '#444444';
        $record->select_color   = '#777777';
        $record->vector_opacity = 1;
        $record->select_opacity = 4;
        $record->stroke_opacity = 7;
        $record->image_opacity  = 10;
        $record->stroke_width   = 13;
        $record->point_radius   = 16;
        $record->point_image    = 'https://www.google.com/favicon.ico';
        $record->min_zoom       = 19;
        $record->max_zoom       = 22;
        $record->save();


        // *** Case 1 ***
        // The record is map-active.

        // Write the fixture.
        $this->writeFixture('neatline/record/'.$record->id,
            'record.standard.json');


        // *** Case 2 ***
        // The record is map-inactive.

        $record->map_active = 0;
        $record->save();

        // Write the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/record/'.$record->id,
            'record.inactive.json');

    }


    /**
     * JSON for new tag (POST response):
     *
     * `tag.standard.json`
     */
    public function testTagJson()
    {

        // Create exhibit and tag.
        $exhibit = $this->__exhibit();
        $tag = $this->__tag($exhibit, 'tag', true);

        // Write the fixture.
        $this->writeFixture('neatline/tag/'.$tag->id,
            'tag.standard.json');

    }


    /**
     * JSON for new record (POST response):
     *
     * `record.add.json`
     */
    public function testNewRecordJson()
    {
        $exhibit = $this->__exhibit();
        $this->request->setMethod('POST');
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'record.add.json');
    }


    /**
     * JSON for new tag (POST response):
     *
     * `tag.add.json`
     */
    public function testNewTagJson()
    {
        $exhibit = $this->__exhibit();
        $this->request->setMethod('POST');
        $this->writeFixture('neatline/tags/'.$exhibit->id,
            'tag.add.json');
    }


    /**
     * Neatline partial markup:
     *
     * `neatline-partial.html`
     */
    public function testNeatlinePartial()
    {
        $this->writeFixture('neatline/fixtures/neatline',
            'neatline-partial.html');
    }


    /**
     * Editor partial markup:
     *
     * `editor-partial.html`
     */
    public function testEditorPartial()
    {
        $this->writeFixture('neatline/fixtures/editor',
            'editor-partial.html');
    }


}
