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
        $record->body               = '5';
        $record->coverage           = 'POINT(6 6)';
        $record->tags               = '7';
        $record->map_focus          = '8';
        $record->map_zoom           = 9;
        $record->presenter          = '10';
        $record->fill_color         = '11';
        $record->select_color       = '12';
        $record->stroke_color       = '13';
        $record->fill_opacity       = 14;
        $record->select_opacity     = 15;
        $record->stroke_opacity     = 16;
        $record->stroke_width       = 17;
        $record->point_radius       = 18;
        $record->point_image        = '19';
        $record->max_zoom           = 20;
        $record->min_zoom           = 21;
        $record->__save();

        $record = $this->__records->find($record->id);

        $this->assertEquals($record->item_id,           1);
        $this->assertEquals($record->item_title,        '2');
        $this->assertEquals($record->exhibit_id,        3);
        $this->assertEquals($record->title,             '4');
        $this->assertEquals($record->body,              '5');
        $this->assertEquals($record->coverage,          'POINT(6 6)');
        $this->assertEquals($record->tags,              '7');
        $this->assertEquals($record->map_focus,         '8');
        $this->assertEquals($record->map_zoom,          9);
        $this->assertEquals($record->presenter,         '10');
        $this->assertEquals($record->fill_color,        '11');
        $this->assertEquals($record->select_color,      '12');
        $this->assertEquals($record->stroke_color,      '13');
        $this->assertEquals($record->fill_opacity,      14);
        $this->assertEquals($record->select_opacity,    15);
        $this->assertEquals($record->stroke_opacity,    16);
        $this->assertEquals($record->stroke_width,      17);
        $this->assertEquals($record->point_radius,      18);
        $this->assertEquals($record->point_image,       '19');
        $this->assertEquals($record->max_zoom,          20);
        $this->assertEquals($record->min_zoom,          21);

    }


}
