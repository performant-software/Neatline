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
        $record = new NeatlineRecord(null, $exhibit);

        // Text.
        $record->title                  = 'Title';
        $record->body                   = 'Body.';
        $record->slug                   = 'slug';

        // Styles.
        $record->vector_color           = '#1';
        $record->stroke_color           = '#2';
        $record->select_color           = '#3';
        $record->vector_opacity         = 1;
        $record->select_opacity         = 2;
        $record->stroke_opacity         = 3;
        $record->image_opacity          = 4;
        $record->stroke_width           = 5;
        $record->point_radius           = 6;
        $record->point_image            = 'file.png';
        $record->min_zoom               = 7;
        $record->max_zoom               = 8;

        // Map.
        $record->map_focus              = 'lat/lon';
        $record->map_zoom               = 9;

        // Statuses.
        $record->map_active             = 1;

        $record->save();

        // Ping the method for the json.
        $data = $record->buildJsonData('POINT(1 1)');

        $this->assertEquals(
            $data,
            array(

                'id'                    => $record->id,
                'item_id'               => $record->item_id,

                // Text.
                'title'                 => 'Title',
                'body'                  => 'Body.',
                'slug'                  => 'slug',

                // Styles.
                'vector_color'          => '#1',
                'stroke_color'          => '#2',
                'select_color'          => '#3',
                'vector_opacity'        => 1,
                'select_opacity'        => 2,
                'stroke_opacity'        => 3,
                'image_opacity'         => 4,
                'stroke_width'          => 5,
                'point_radius'          => 6,
                'point_image'           => 'file.png',
                'min_zoom'              => 7,
                'max_zoom'              => 8,

                // Map.
                'map_focus'             => 'lat/lon',
                'map_zoom'              => 9,
                'coverage'              => 'POINT(1 1)',
                'wmsAddress'            => null,
                'layers'                => null,

                // Statuses.
                'map_active'            => 1

            )
        );

    }


}
