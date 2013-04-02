<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * JSON fixture generators.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_Json extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * Create exhibit, set parameter on request.
     */
    public function setUp()
    {

        parent::setUp();

        // Create exhibit.
        $this->exhibit = $this->__exhibit();

        // Set GET parameter.
        $this->request->setQuery(array(
          'exhibit_id' => $this->exhibit->id
        ));

    }


    /**
     * GET /records
     * `records.standard.json`
     * `records.changed.json`
     * `records.removed.json`
     */
    public function testRecordsJson()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        // `records.standard.json`
        // - #1 has a default map focus/zoom, #2 and #3 do not.

        $record1->item_id           = 1;
        $record1->title             = 'title1';
        $record1->body              = 'body1';
        $record1->tags              = 'tags1';
        $record1->coverage          = 'POINT(1 2)';
        $record1->presenter         = 'StaticBubble';
        $record1->fill_color        = '#111111';
        $record1->select_color      = '#222222';
        $record1->stroke_color      = '#333333';
        $record1->fill_opacity      = 4;
        $record1->select_opacity    = 5;
        $record1->stroke_opacity    = 6;
        $record1->stroke_width      = 7;
        $record1->point_radius      = 8;
        $record1->weight            = 9;
        $record1->start_date        = '10';
        $record1->end_date          = '11';
        $record1->point_image       = '12';
        $record1->wms_address       = '13';
        $record1->wms_layers        = '14';
        $record1->min_zoom          = 15;
        $record1->max_zoom          = 16;
        $record1->show_after_date   = '17';
        $record1->show_before_date  = '18';
        $record1->map_focus         = '100,200';
        $record1->map_zoom          = 10;

        $record2->title             = 'title2';
        $record3->title             = 'title3';
        $record2->body              = 'body2';
        $record3->body              = 'body3';
        $record2->coverage          = 'POINT(3 4)';
        $record3->coverage          = 'POINT(5 6)';

        $record1->__save();
        $record2->__save();
        $record3->__save();

        $this->writeFixtureFromRoute('neatline/records',
            'records.standard.json');

        // `records.changed.json`
        // Data for #2 has changed.

        $record2->coverage = 'POINT(7 8)';
        $record2->__save();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'records.changed.json');

        // `records.removed.json`
        // #2 has been deleted from the collection.

        $record2->delete();

        // Write the fixture.
        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'records.removed.json');

    }


    /**
     * GET /records
     * `records.p12.json`   (records 1-2)
     * `records.p23.json`   (records 2-3)
     * `records.p34.json`   (records 3-4)
     * `records.p56.json`   (records 5-6)
     * `records.p6.json`    (record 6)
     */
    public function testPaginatedRecordsJson()
    {

        for ($i = 0; $i<6; $i++) {
            $record = new NeatlineRecord($this->exhibit);
            $record->added  = '200'.$i.'-01-01';
            $record->title  = 'Record'.$i;
            $record->__save();
        }

        // Records 1-2.
        $this->request->setQuery(array('limit' => 2, 'offset' => 0));
        $this->writeFixtureFromRoute('neatline/records',
            'records.p12.json');

        // Records 2-3.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 1));
        $this->writeFixtureFromRoute('neatline/records',
            'records.p23.json');

        // Records 3-4.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 2));
        $this->writeFixtureFromRoute('neatline/records',
            'records.p34.json');

        // Records 5-6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 4));
        $this->writeFixtureFromRoute('neatline/records',
            'records.p56.json');

        // Record 6.
        $this->resetResponse();
        $this->request->setQuery(array('limit' => 2, 'offset' => 5));
        $this->writeFixtureFromRoute('neatline/records',
            'records.p6.json');

    }


    /**
     * GET /records/:id
     * `records.tags.json`
     */
    public function testTagsRecordsJson()
    {

        $record = new NeatlineRecord($this->exhibit);
        $record->title  = '<tag>title</tag>';
        $record->body   = '<tag>body</tag>';
        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'records.tags.json');

    }


    /**
     * GET /records/:id
     * `records.emptyTitle.json`
     */
    public function testEmptyTitleRecordsJson()
    {
        $record = $this->__record($this->exhibit);
        $this->writeFixtureFromRoute('neatline/records',
            'records.noTitle.json');
    }


    /**
     * GET /records/:id
     * `record.standard.json`
     */
    public function testRecordJson()
    {

        $item   = $this->__item();
        $record = $this->__record($this->exhibit, $item);

        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tags';
        $record->coverage           = 'POINT(1 2)';
        $record->presenter          = 'StaticBubble';
        $record->fill_color         = '#111111';
        $record->select_color       = '#222222';
        $record->stroke_color       = '#333333';
        $record->fill_opacity       = 4;
        $record->select_opacity     = 5;
        $record->stroke_opacity     = 6;
        $record->stroke_width       = 7;
        $record->point_radius       = 8;
        $record->weight             = 9;
        $record->start_date         = '10';
        $record->end_date           = '11';
        $record->point_image        = '12';
        $record->wms_address        = '13';
        $record->wms_layers         = '14';
        $record->min_zoom           = 15;
        $record->max_zoom           = 16;
        $record->show_after_date    = '17';
        $record->show_before_date   = '18';
        $record->map_focus          = '100,200';
        $record->map_zoom           = 10;
        $record->__save();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'record.standard.json');

    }


    /**
     * POST /records
     * `record.add.json`
     */
    public function testNewRecordJson()
    {

        $exhibit = $this->__exhibit();

        // New record data.
        $this->request->setMethod('POST')->setRawBody(
          Zend_Json::encode(array(
            'exhibit_id'    => $exhibit->id,
            'coverage'      => 'POINT(1 1)'
        )));

        $this->request->setMethod('POST');
        $this->writeFixtureFromRoute('neatline/records',
            'record.add.json');

    }


    /**
     * GET /exhibits/:id
     * `exhibit.json`
     */
    public function testExhibitJson()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles    = '1';
        $exhibit->map_focus = '2';
        $exhibit->map_zoom  = '3';
        $exhibit->save();

        $this->writeFixtureFromRoute('neatline/exhibits/'.$exhibit->id,
            'exhibit.json');

    }


}
