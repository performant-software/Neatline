<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generators for the records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsJsonFixtureTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * GET /records/:id
     * `records.standard.json`
     * `records.changed.json`
     * `records.removed.json`
     */
    public function testRecordsJson()
    {

        $exhibit = $this->__exhibit();
        $record1 = $this->__record($exhibit);
        $record2 = $this->__record($exhibit);
        $record3 = $this->__record($exhibit);

        // `records.standard.json`
        // - #1 and #2 are map-active, #3 map-inactive.
        // - #1 has a default map focus/zoom, #2 and #3 do not.

        $record1->title             = 'title1';
        $record2->title             = 'title2';
        $record3->title             = 'title3';
        // ----------------------------------------------------------------
        $record1->body              = 'body1';
        $record2->body              = 'body2';
        $record3->body              = 'body3';
        // ----------------------------------------------------------------
        $record1->tags              = 'tags1';
        $record2->tags              = 'tags2';
        $record3->tags              = 'tags3';
        // ----------------------------------------------------------------
        $record1->coverage          = 'POINT(1 2)';
        $record2->coverage          = 'POINT(3 4)';
        $record3->coverage          = 'POINT(5 6)';
        // ----------------------------------------------------------------
        $record1->map_focus         = '100,200';
        $record1->map_zoom          = 10;
        // ----------------------------------------------------------------
        $record1->vector_color      = '1';
        $record2->vector_color      = '2';
        $record3->vector_color      = '3';
        // ----------------------------------------------------------------
        $record1->stroke_color      = '4';
        $record2->stroke_color      = '5';
        $record3->stroke_color      = '6';
        // ----------------------------------------------------------------
        $record1->select_color      = '7';
        $record2->select_color      = '8';
        $record3->select_color      = '9';
        // ----------------------------------------------------------------
        $record1->vector_opacity    = 10;
        $record2->vector_opacity    = 11;
        $record3->vector_opacity    = 12;
        // ----------------------------------------------------------------
        $record1->select_opacity    = 13;
        $record2->select_opacity    = 14;
        $record3->select_opacity    = 15;
        // ----------------------------------------------------------------
        $record1->stroke_opacity    = 16;
        $record2->stroke_opacity    = 17;
        $record3->stroke_opacity    = 18;
        // ----------------------------------------------------------------
        $record1->image_opacity     = 19;
        $record2->image_opacity     = 20;
        $record3->image_opacity     = 21;
        // ----------------------------------------------------------------
        $record1->stroke_width      = 22;
        $record2->stroke_width      = 23;
        $record3->stroke_width      = 24;
        // ----------------------------------------------------------------
        $record1->point_radius      = 25;
        $record2->point_radius      = 26;
        $record3->point_radius      = 27;
        // ----------------------------------------------------------------
        $record1->min_zoom          = 28;
        $record2->min_zoom          = 29;
        $record3->min_zoom          = 30;
        // ----------------------------------------------------------------
        $record1->max_zoom          = 31;
        $record2->max_zoom          = 32;
        $record3->max_zoom          = 33;
        // ----------------------------------------------------------------
        $record1->point_image = 'https://www.google.com/favicon.ico';
        $record2->point_image = 'http://en.wikipedia.org/favicon.ico';
        $record3->point_image = 'http://www.amazon.com/favicon.ico';
        // ----------------------------------------------------------------
        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.standard.json');

        // `records.changed.json`
        // Coverage data for #2 has changed.

        $record2->coverage = 'POINT(7 8)';
        $record2->save();

        $this->resetResponse();
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.changed.json');


        // `records.removed.json`
        // #2 has been deleted from the collection.

        $record2->delete();

        // Write the fixture.
        $this->resetResponse();
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.removed.json');

    }


}
