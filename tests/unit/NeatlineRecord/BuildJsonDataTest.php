<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `buildJsonData()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_BuildJsonData
    extends Neatline_Test_AppTestCase
{


    /**
     * buildJsonData() should construct a well-formed array object with
     * all attributes necessary for the front-end application.
     */
    public function testBuildJsonData()
    {

        $exhibit    = $this->__exhibit();
        $item       = $this->__item();

        $record = new NeatlineRecord($exhibit, $item);

        $record->title              = '1';
        $record->body               = '2';
        $record->tags               = '3';
        $record->slug               = '4';
        $record->vector_color       = '5';
        $record->stroke_color       = '6';
        $record->select_color       = '7';
        $record->vector_opacity     = 8;
        $record->select_opacity     = 9;
        $record->stroke_opacity     = 10;
        $record->image_opacity      = 11;
        $record->stroke_width       = 12;
        $record->point_radius       = 13;
        $record->point_image        = '14';
        $record->min_zoom           = 15;
        $record->max_zoom           = 16;
        $record->map_focus          = '17';
        $record->map_zoom           = 18;
        $record->coverage           = 'POINT(19 19)';
        $record->save();

        $data = $record->buildJsonData();

        $this->assertEquals($data['id'],                $record->id);
        $this->assertEquals($data['item_id'],           $item->id);
        $this->assertEquals($data['title'],             '1');
        $this->assertEquals($data['_title'],            '1');
        $this->assertEquals($data['body'],              '2');
        $this->assertEquals($data['_body'],             '2');
        $this->assertEquals($data['tags'],              '3');
        $this->assertEquals($data['slug'],              '4');
        $this->assertEquals($data['vector_color'],      '5');
        $this->assertEquals($data['stroke_color'],      '6');
        $this->assertEquals($data['select_color'],      '7');
        $this->assertEquals($data['vector_opacity'],    8);
        $this->assertEquals($data['select_opacity'],    9);
        $this->assertEquals($data['stroke_opacity'],    10);
        $this->assertEquals($data['image_opacity'],     11);
        $this->assertEquals($data['stroke_width'],      12);
        $this->assertEquals($data['point_radius'],      13);
        $this->assertEquals($data['point_image'],       '14');
        $this->assertEquals($data['min_zoom'],          15);
        $this->assertEquals($data['max_zoom'],          16);
        $this->assertEquals($data['map_focus'],         '17');
        $this->assertEquals($data['map_zoom'],          18);
        $this->assertEquals($data['coverage'],          'POINT(19 19)');

    }


}
