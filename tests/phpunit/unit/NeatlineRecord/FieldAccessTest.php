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
        $record->title              = '3';
        $record->body               = '4';
        $record->coverage           = 'POINT(5 5)';
        $record->tags               = '6';
        $record->map_focus          = '7';
        $record->map_zoom           = 8;
        $record->presenter          = '9';
        $record->fill_color         = '10';
        $record->select_color       = '11';
        $record->stroke_color       = '12';
        $record->fill_opacity       = 13;
        $record->select_opacity     = 14;
        $record->stroke_opacity     = 15;
        $record->stroke_width       = 16;
        $record->point_radius       = 17;
        $record->point_image        = '18';
        $record->max_zoom           = 19;
        $record->min_zoom           = 20;
        $record->__save();

        $record = $this->__records->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->exhibit_id,        2);
        $this->assertEquals($record->title,             '3');
        $this->assertEquals($record->body,              '4');
        $this->assertEquals($record->coverage,          'POINT(5 5)');
        $this->assertEquals($record->tags,              '6');
        $this->assertEquals($record->map_focus,         '7');
        $this->assertEquals($record->map_zoom,          8);
        $this->assertEquals($record->presenter,         '9');
        $this->assertEquals($record->fill_color,        '10');
        $this->assertEquals($record->select_color,      '11');
        $this->assertEquals($record->stroke_color,      '12');
        $this->assertEquals($record->fill_opacity,      13);
        $this->assertEquals($record->select_opacity,    14);
        $this->assertEquals($record->stroke_opacity,    15);
        $this->assertEquals($record->stroke_width,      16);
        $this->assertEquals($record->point_radius,      17);
        $this->assertEquals($record->point_image,       '18');
        $this->assertEquals($record->max_zoom,          19);
        $this->assertEquals($record->min_zoom,          20);

    }


}
