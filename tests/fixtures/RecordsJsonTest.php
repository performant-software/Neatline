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

        // ----------------------------------------------------------------
        $record1->title             = 'title1';
        $record2->title             = 'title2';
        $record3->title             = 'title3';
        // ----------------------------------------------------------------
        $record1->_title            = '_title1';
        $record2->_title            = '_title2';
        $record3->_title            = '_title3';
        // ----------------------------------------------------------------
        $record1->body              = 'body1';
        $record2->body              = 'body2';
        $record3->body              = 'body3';
        // ----------------------------------------------------------------
        $record1->_body             = '_body1';
        $record2->_body             = '_body2';
        $record3->_body             = '_body3';
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
        $record1->point_image       = '28';
        $record2->point_image       = '29';
        $record3->point_image       = '30';
        // ----------------------------------------------------------------
        $record1->min_zoom          = 31;
        $record2->min_zoom          = 32;
        $record3->min_zoom          = 33;
        // ----------------------------------------------------------------
        $record1->max_zoom          = 34;
        $record2->max_zoom          = 35;
        $record3->max_zoom          = 36;
        // ----------------------------------------------------------------

        $record1->__save();
        $record2->__save();
        $record3->__save();

        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.standard.json');

        // `records.changed.json`
        // Coverage data for #2 has changed.

        $record2->coverage = 'POINT(7 8)';
        $record2->__save();

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


    /**
     * GET /records/:id
     * `records.p1.json`
     * `records.p2.json`
     * `records.p3.json`
     */
    public function testPaginatedRecordsJson()
    {

        $exhibit = $this->__exhibit();

        // Create 6 records.
        for ($i = 0; $i<6; $i++) {
            $record = new NeatlineRecord($exhibit);
            $record->added  = '200'.$i.'-01-01';
            $record->title  = 'Record'.$i;
            $record->_title = '_Record'.$i;
            $record->__save();
        }

        // Records 1-2.
        $this->request->setQuery(array('limit' => 2, 'offset' => 0));
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.p12.json');

        // Records 2-3.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 1));
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.p23.json');

        // Records 3-4.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 2));
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.p34.json');

        // Records 5-6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 4));
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.p56.json');

        // Records 6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 5));
        $this->writeFixture('neatline/records/'.$exhibit->id,
            'records.p6.json');

    }


}
