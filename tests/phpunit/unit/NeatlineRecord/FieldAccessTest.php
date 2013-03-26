<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_FieldAccess extends Neatline_TestCase
{


    /**
     * Test field set/get.
     */
    public function testFieldAccess()
    {

        $record = $this->__record();

        $record->item_id            = 1;
        $record->exhibit_id         = 2;
        $record->widgets            = '3';
        $record->title              = '4';
        $record->body               = '5';
        $record->coverage           = 'POINT(6 6)';
        $record->tags               = '7';
        $record->presenter          = '8';
        $record->fill_color         = '9';
        $record->select_color       = '10';
        $record->stroke_color       = '11';
        $record->fill_opacity       = 12;
        $record->select_opacity     = 13;
        $record->stroke_opacity     = 14;
        $record->stroke_width       = 15;
        $record->point_radius       = 16;
        $record->point_image        = '17';
        $record->max_zoom           = 18;
        $record->min_zoom           = 19;
        $record->map_zoom           = 20;
        $record->map_focus          = '21';
        $record->wms_address        = '22';
        $record->wms_layers         = '23';
        $record->start_date         = '24';
        $record->end_date           = '25';
        $record->start_show_date    = '26';
        $record->end_show_date      = '27';
        $record->weight             = 28;

        $record->__save();
        $record = $this->__records->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->exhibit_id,        2);
        $this->assertEquals($record->widgets,           '3');
        $this->assertEquals($record->title,             '4');
        $this->assertEquals($record->body,              '5');
        $this->assertEquals($record->coverage,          'POINT(6 6)');
        $this->assertEquals($record->tags,              '7');
        $this->assertEquals($record->presenter,         '8');
        $this->assertEquals($record->fill_color,        '9');
        $this->assertEquals($record->select_color,      '10');
        $this->assertEquals($record->stroke_color,      '11');
        $this->assertEquals($record->fill_opacity,      12);
        $this->assertEquals($record->select_opacity,    13);
        $this->assertEquals($record->stroke_opacity,    14);
        $this->assertEquals($record->stroke_width,      15);
        $this->assertEquals($record->point_radius,      16);
        $this->assertEquals($record->point_image,       '17');
        $this->assertEquals($record->max_zoom,          18);
        $this->assertEquals($record->min_zoom,          19);
        $this->assertEquals($record->map_zoom,          20);
        $this->assertEquals($record->map_focus,         '21');
        $this->assertEquals($record->wms_address,       '22');
        $this->assertEquals($record->wms_layers,        '23');
        $this->assertEquals($record->start_date,        '24');
        $this->assertEquals($record->end_date,          '25');
        $this->assertEquals($record->start_show_date,   '26');
        $this->assertEquals($record->end_show_date,     '27');
        $this->assertEquals($record->weight,            '28');

    }


}
