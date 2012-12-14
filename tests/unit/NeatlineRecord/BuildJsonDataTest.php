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

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record = new NeatlineRecord($exhibit);

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
        $record->map_active         = 16;
        $record->map_focus          = '17';
        $record->map_zoom           = 18;
        $record->save();

        // Construct the array.
        $data = $record->buildJsonData('19');

        $this->assertEquals($data,
            array(

                // Relations:
                'id'                => $record->id,
                'item_id'           => $record->item_id,

                // Text:
                'title'             => '1',
                'body'              => '2',
                'slug'              => '3',

                // Styles:
                'vector_color'      => '4',
                'stroke_color'      => '5',
                'select_color'      => '6',
                'vector_opacity'    => 7,
                'select_opacity'    => 8,
                'stroke_opacity'    => 9,
                'image_opacity'     => 10,
                'stroke_width'      => 11,
                'point_radius'      => 12,
                'point_image'       => '13',
                'min_zoom'          => 14,
                'max_zoom'          => 15,

                // Map:
                'map_active'        => 16,
                'map_focus'         => '17',
                'map_zoom'          => 18,
                'coverage'          => '19'

            )
        );

    }


}
