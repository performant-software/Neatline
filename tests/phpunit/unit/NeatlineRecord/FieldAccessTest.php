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
        $record->item_title         = '2';
        $record->exhibit_id         = 3;
        $record->title              = '4';
        $record->_title             = '5';
        $record->body               = '6';
        $record->_body              = '7';
        $record->coverage           = 'POINT(8 8)';
        $record->tags               = '9';
        $record->map_focus          = '10';
        $record->map_zoom           = 11;
        $record->presenter          = '12';
        $record->fill_color         = '13';
        $record->select_color       = '14';
        $record->stroke_color       = '15';
        $record->fill_opacity       = 16;
        $record->select_opacity     = 17;
        $record->stroke_opacity     = 18;
        $record->stroke_width       = 19;
        $record->point_radius       = 20;
        $record->point_image        = '21';
        $record->max_zoom           = 22;
        $record->min_zoom           = 23;
        $record->__save();

        $record = $this->__records->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->item_title,        '2');
        $this->assertEquals($record->exhibit_id,        3);
        $this->assertEquals($record->title,             '4');
        $this->assertEquals($record->_title,            '5');
        $this->assertEquals($record->body,              '6');
        $this->assertEquals($record->_body,             '7');
        $this->assertEquals($record->coverage,          'POINT(8 8)');
        $this->assertEquals($record->tags,              '9');
        $this->assertEquals($record->map_focus,         '10');
        $this->assertEquals($record->map_zoom,          11);
        $this->assertEquals($record->presenter,         '12');
        $this->assertEquals($record->fill_color,        '13');
        $this->assertEquals($record->select_color,      '14');
        $this->assertEquals($record->stroke_color,      '15');
        $this->assertEquals($record->fill_opacity,      16);
        $this->assertEquals($record->select_opacity,    17);
        $this->assertEquals($record->stroke_opacity,    18);
        $this->assertEquals($record->stroke_width,      19);
        $this->assertEquals($record->point_radius,      20);
        $this->assertEquals($record->point_image,       '21');
        $this->assertEquals($record->max_zoom,          22);
        $this->assertEquals($record->min_zoom,          23);

    }


}
