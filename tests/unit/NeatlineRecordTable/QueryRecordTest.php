<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryRecord()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_QueryRecord
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * queryRecord() should retrieve the data record with a given id and
     * construct an associative array that contains all of the information
     * about the record needed by the front end application.
     * --------------------------------------------------------------------
     */
    public function testQueryRecord()
    {

        $exhibit = $this->__exhibit();
        $item = $this->__item();

        $record = new NeatlineRecord($exhibit, $item);

        $record->title              = '1';
        $record->body               = '2';
        $record->coverage           = 'POINT(1 1)';
        $record->svg                = '3';
        $record->tags               = '4';
        $record->slug               = '5';
        $record->vector_color       = '6';
        $record->stroke_color       = '7';
        $record->select_color       = '8';
        $record->vector_opacity     = 9;
        $record->select_opacity     = 10;
        $record->stroke_opacity     = 11;
        $record->image_opacity      = 12;
        $record->stroke_width       = 13;
        $record->point_radius       = 14;
        $record->point_image        = '15';
        $record->min_zoom           = 16;
        $record->max_zoom           = 17;
        $record->map_focus          = '18';
        $record->map_zoom           = 19;
        $record->save();

        $records = $this->_recordsTable->queryRecord($record->id);

        $this->assertEquals($records['id'],                 $record->id);
        $this->assertEquals($records['item_id'],            $item->id);
        $this->assertEquals($records['title'],              '1');
        $this->assertEquals($records['_title'],             '1');
        $this->assertEquals($records['body'],               '2');
        $this->assertEquals($records['_body'],              '2');
        $this->assertEquals($records['coverage'],           'POINT(1 1)');
        $this->assertEquals($records['svg'],                '3');
        $this->assertEquals($records['tags'],               '4');
        $this->assertEquals($records['slug'],               '5');
        $this->assertEquals($records['vector_color'],       '6');
        $this->assertEquals($records['stroke_color'],       '7');
        $this->assertEquals($records['select_color'],       '8');
        $this->assertEquals($records['vector_opacity'],     9);
        $this->assertEquals($records['select_opacity'],     10);
        $this->assertEquals($records['stroke_opacity'],     11);
        $this->assertEquals($records['image_opacity'],      12);
        $this->assertEquals($records['stroke_width'],       13);
        $this->assertEquals($records['point_radius'],       14);
        $this->assertEquals($records['point_image'],        '15');
        $this->assertEquals($records['min_zoom'],           16);
        $this->assertEquals($records['max_zoom'],           17);
        $this->assertEquals($records['map_focus'],          '18');
        $this->assertEquals($records['map_zoom'],           19);

    }


}
