<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryRecord` on `NeatlineRecordTable`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecord extends Neatline_TestCase
{


    /**
     * --------------------------------------------------------------------
     * `queryRecord` should fetch an individual record.
     * --------------------------------------------------------------------
     */
    public function testQueryRecord()
    {

        $exhibit  = $this->__exhibit();
        $item     = $this->__item();
        $record   = new NeatlineRecord($exhibit, $item);

        $record->title              = '1';
        $record->body               = '2';
        $record->coverage           = 'POINT(3 3)';
        $record->tags               = '4';
        $record->widgets            = '5';
        $record->presenter          = '6';
        $record->fill_color         = '7';
        $record->select_color       = '8';
        $record->stroke_color       = '9';
        $record->fill_opacity       = 10;
        $record->select_opacity     = 11;
        $record->stroke_opacity     = 12;
        $record->stroke_width       = 13;
        $record->point_radius       = 14;
        $record->point_image        = '15';
        $record->min_zoom           = 16;
        $record->max_zoom           = 17;
        $record->map_zoom           = 18;
        $record->map_focus          = '19';
        $record->wms_address        = '20';
        $record->wms_layers         = '21';
        $record->start_date         = '22';
        $record->end_date           = '23';
        $record->show_after_date    = '24';
        $record->show_before_date   = '25';
        $record->weight             = 26;

        $record->__save();
        $records = $this->__records->queryRecord($record->id);

        $this->assertEquals($records['id'],                 $record->id);
        $this->assertEquals($records['item_id'],            $item->id);
        $this->assertEquals($records['title'],              '1');
        $this->assertEquals($records['body'],               '2');
        $this->assertEquals($records['coverage'],           'POINT(3 3)');
        $this->assertEquals($records['tags'],               '4');
        $this->assertEquals($records['widgets'],            '5');
        $this->assertEquals($records['presenter'],          '6');
        $this->assertEquals($records['fill_color'],         '7');
        $this->assertEquals($records['select_color'],       '8');
        $this->assertEquals($records['stroke_color'],       '9');
        $this->assertEquals($records['fill_opacity'],       10);
        $this->assertEquals($records['select_opacity'],     11);
        $this->assertEquals($records['stroke_opacity'],     12);
        $this->assertEquals($records['stroke_width'],       13);
        $this->assertEquals($records['point_radius'],       14);
        $this->assertEquals($records['point_image'],        '15');
        $this->assertEquals($records['min_zoom'],           16);
        $this->assertEquals($records['max_zoom'],           17);
        $this->assertEquals($records['map_zoom'],           18);
        $this->assertEquals($records['map_focus'],          '19');
        $this->assertEquals($records['wms_address'],        '20');
        $this->assertEquals($records['wms_layers'],         '21');
        $this->assertEquals($records['start_date'],         '22');
        $this->assertEquals($records['end_date'],           '23');
        $this->assertEquals($records['show_after_date'],    '24');
        $this->assertEquals($records['show_before_date'],   '25');
        $this->assertEquals($records['weight'],             26);

    }


}
