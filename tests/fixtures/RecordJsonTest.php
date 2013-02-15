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
     * GET /record/:id
     * `record.standard.json`
     */
    public function testRecordJson()
    {

        $exhibit    = $this->__exhibit();
        $item       = $this->__item();
        $record     = $this->__record($exhibit, $item);

        $record->title              = 'title';
        $record->_title             = '_title';
        $record->body               = 'body';
        $record->_body              = '_body';
        $record->tags               = 'tags';
        $record->coverage           = 'POINT(1 2)';
        $record->map_focus          = '100,200';
        $record->map_zoom           = 10;
        $record->presenter          = 'StaticBubble';
        $record->vector_color       = '#111111';
        $record->stroke_color       = '#222222';
        $record->select_color       = '#333333';
        $record->vector_opacity     = 4;
        $record->select_opacity     = 5;
        $record->stroke_opacity     = 6;
        $record->image_opacity      = 7;
        $record->stroke_width       = 8;
        $record->point_radius       = 9;
        $record->point_image        = '10';
        $record->min_zoom           = 11;
        $record->max_zoom           = 12;
        $record->__save();

        $this->writeFixture('neatline/record/'.$record->id,
            'record.standard.json');

    }


    /**
     * POST /record
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
        $this->writeFixture('neatline/record',
            'record.add.json');

    }


}
