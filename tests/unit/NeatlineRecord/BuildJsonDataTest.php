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
     * --------------------------------------------------------------------
     * buildJsonData() should construct a well-formed array object with
     * all attributes necessary for the front-end application.
     * --------------------------------------------------------------------
     */
    public function testBuildJsonData()
    {

        // Create exhibit and item.
        $exhibit = $this->__exhibit();
        $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);

        // Text:
        $record->title              = '1';
        $record->body               = '2';
        $record->slug               = '3';

        // Styles:
        $record->vector_color       = '4';
        $record->stroke_color       = '5';
        $record->select_color       = '6';
        $record->vector_opacity     = 7;
        $record->select_opacity     = 8;
        $record->stroke_opacity     = 9;
        $record->image_opacity      = 10;
        $record->stroke_width       = 11;
        $record->point_radius       = 12;
        $record->point_image        = '13';
        $record->min_zoom           = 14;
        $record->max_zoom           = 15;

        // Map:
        $record->map_active         = 0;
        $record->map_focus          = '16';
        $record->map_zoom           = 17;
        $record->coverage           = 'POINT(1 1)';
        $record->save();

        // Construct the array.
        $data = $record->buildJsonData();

        // Check result.
        $this->assertEquals($data['id'],                $record->id);
        $this->assertEquals($data['item_id'],           $item->id);
        $this->assertEquals($data['title'],             '1');
        $this->assertEquals($data['body'],              '2');
        $this->assertEquals($data['slug'],              '3');
        $this->assertEquals($data['vector_color'],      '4');
        $this->assertEquals($data['stroke_color'],      '5');
        $this->assertEquals($data['select_color'],      '6');
        $this->assertEquals($data['vector_opacity'],    7);
        $this->assertEquals($data['select_opacity'],    8);
        $this->assertEquals($data['stroke_opacity'],    9);
        $this->assertEquals($data['image_opacity'],     10);
        $this->assertEquals($data['stroke_width'],      11);
        $this->assertEquals($data['point_radius'],      12);
        $this->assertEquals($data['point_image'],       '13');
        $this->assertEquals($data['min_zoom'],          14);
        $this->assertEquals($data['max_zoom'],          15);
        $this->assertEquals($data['map_active'],        0);
        $this->assertEquals($data['map_focus'],         '16');
        $this->assertEquals($data['map_zoom'],          17);
        $this->assertEquals($data['coverage'],          'POINT(1 1)');

    }


}
