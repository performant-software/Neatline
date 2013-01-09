<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generators for the record API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordJsonFixtureTest extends Neatline_Test_AppTestCase
{


    protected $_isAdminTest = false;


    /**
     * JSON for individual records (GET response):
     *
     * `record.standard.json`
     * `record.inactive.json`
     */
    public function testRecordJson()
    {

        // Exhibit and record.
        $exhibit    = $this->__exhibit();
        $record     = $this->__record($exhibit);

        $yc = 'http://news.ycombinator.com/';

        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tags';
        $record->coverage           = 'POINT(1 2)';
        $record->map_active         = 1;
        $record->map_focus          = '100,200';
        $record->map_zoom           = 10;
        $record->vector_color       = '1';
        $record->stroke_color       = '2';
        $record->select_color       = '3';
        $record->vector_opacity     = 4;
        $record->select_opacity     = 5;
        $record->stroke_opacity     = 6;
        $record->image_opacity      = 7;
        $record->stroke_width       = 8;
        $record->point_radius       = 9;
        $record->min_zoom           = 10;
        $record->max_zoom           = 11;
        $record->point_image        = $yc;
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


}
