<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `buildJsonData` on `NeatlineRecord`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_BuildJsonData extends Neatline_TestCase
{


    /**
     * `buildJsonData` should construct a well-formed array object with
     * all attributes necessary for the front-end application.
     */
    public function testBuildJsonData()
    {

        $exhibit  = $this->__exhibit();
        $item     = $this->__item();
        $record   = new NeatlineRecord($exhibit, $item);

        $record->item_title         = '1';
        $record->title              = '2';
        $record->body               = '3';
        $record->tags               = '4';
        $record->fill_color         = '5';
        $record->select_color       = '6';
        $record->stroke_color       = '7';
        $record->fill_opacity       = 8;
        $record->select_opacity     = 9;
        $record->stroke_opacity     = 10;
        $record->stroke_width       = 11;
        $record->point_radius       = 12;
        $record->point_image        = '13';
        $record->min_zoom           = 14;
        $record->max_zoom           = 15;
        $record->map_focus          = '16';
        $record->map_zoom           = 17;
        $record->coverage           = 'POINT(18 18)';
        $record->save();

        $data = $record->buildJsonData();

        $this->assertEquals($data['id'],                $record->id);
        $this->assertEquals($data['item_id'],           $item->id);
        $this->assertEquals($data['item_title'],        '1');
        $this->assertEquals($data['title'],             '2');
        $this->assertEquals($data['_title'],            '2');
        $this->assertEquals($data['body'],              '3');
        $this->assertEquals($data['_body'],             '3');
        $this->assertEquals($data['tags'],              '4');
        $this->assertEquals($data['fill_color'],        '5');
        $this->assertEquals($data['select_color'],      '6');
        $this->assertEquals($data['stroke_color'],      '7');
        $this->assertEquals($data['fill_opacity'],      8);
        $this->assertEquals($data['select_opacity'],    9);
        $this->assertEquals($data['stroke_opacity'],    10);
        $this->assertEquals($data['stroke_width'],      11);
        $this->assertEquals($data['point_radius'],      12);
        $this->assertEquals($data['point_image'],       '13');
        $this->assertEquals($data['min_zoom'],          14);
        $this->assertEquals($data['max_zoom'],          15);
        $this->assertEquals($data['map_focus'],         '16');
        $this->assertEquals($data['map_zoom'],          17);
        $this->assertEquals($data['coverage'],          'POINT(18 18)');

    }


}
