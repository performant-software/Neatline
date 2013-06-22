<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecord extends Neatline_Case_Fixture
{


    public function setUp()
    {
        parent::setUp();
        $this->_mockRecordWidgets();
        $this->_mockPresenters();
    }


    public function testRecord()
    {

        $record = $this->_record($this->exhibit);

        $record->setArray(array(
            'item_id'               => 1,
            'slug'                  => 'slug',
            'title'                 => 'title',
            'body'                  => 'body',
            'tags'                  => 'tags',
            'coverage'              => 'POINT(1 2)',
            'widgets'               => 'Widget1,Widget3',
            'presenter'             => 'Presenter2',
            'fill_color'            => '#111111',
            'fill_color_select'     => '#222222',
            'stroke_color'          => '#333333',
            'stroke_color_select'   => '#444444',
            'fill_opacity'          => 0.5,
            'fill_opacity_select'   => 0.6,
            'stroke_opacity'        => 0.7,
            'stroke_opacity_select' => 0.8,
            'stroke_width'          => 9,
            'point_radius'          => 10,
            'zindex'                => 11,
            'weight'                => 12,
            'start_date'            => '13',
            'end_date'              => '14',
            'after_date'            => '15',
            'before_date'           => '16',
            'point_image'           => '17',
            'wms_address'           => '18',
            'wms_layers'            => '19',
            'min_zoom'              => 20,
            'max_zoom'              => 21,
            'map_focus'             => '22',
            'map_zoom'              => 23
        ));

        $record->__save();

        $this->_writeFixtureFromRoute('neatline/records/'.$record->id,
            'EditorRecord.record.json'
        );

    }


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorRecord.records.json'
        );

    }


}
