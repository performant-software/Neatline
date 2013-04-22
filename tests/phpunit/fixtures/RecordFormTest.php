<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_RecordForm extends Neatline_FixtureCase
{


    /**
     * `RecordForm.record.json`
     */
    public function testRecord()
    {

        $record = $this->__record($this->exhibit);

        $record->setArray(array(
            'item_id'           => 1,
            'title'             => 'title',
            'body'              => 'body',
            'tags'              => 'tags',
            'coverage'          => 'POINT(1 2)',
            'widgets'           => 'Widget1,Widget3',
            'presenter'         => 'Presenter2',
            'fill_color'        => '#111111',
            'select_color'      => '#222222',
            'stroke_color'      => '#333333',
            'fill_opacity'      => 4,
            'select_opacity'    => 5,
            'stroke_opacity'    => 6,
            'stroke_width'      => 7,
            'point_radius'      => 8,
            'weight'            => 9,
            'start_date'        => '10',
            'end_date'          => '11',
            'point_image'       => '12',
            'wms_address'       => '13',
            'wms_layers'        => '14',
            'min_zoom'          => 15,
            'max_zoom'          => 16,
            'show_after_date'   => '17',
            'show_before_date'  => '18',
            'map_focus'         => '19',
            'map_zoom'          => 20 
        ));

        $record->__save();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'RecordForm.record.json'
        );

    }


    /**
     * `RecordForm.records.json`
     */
    public function testRecords()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record1->added = '2003-01-01';
        $record2->added = '2002-01-01';
        $record3->added = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'RecordForm.records.json'
        );

    }


}
