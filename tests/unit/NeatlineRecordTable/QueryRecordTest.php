<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `queryRecord()` on NeatlineRecordTable.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTableTest_QueryRecord
    extends Neatline_Test_AppTestCase
{


    /**
     * queryRecord() should construct an array representation of a record
     * for the front-end application.
     */
    public function testQueryRecord()
    {

        // Create exhibit and item.
        $exhibit = $this->__exhibit();
        $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($item, $exhibit);

        // Map attributes.
        $record->title              = 'Title';
        $record->body               = 'Body.';
        $record->slug               = 'slug';
        $record->vector_color       = '#1';
        $record->stroke_color       = '#2';
        $record->select_color       = '#3';
        $record->vector_opacity     = 1;
        $record->select_opacity     = 2;
        $record->stroke_opacity     = 3;
        $record->image_opacity      = 4;
        $record->stroke_width       = 5;
        $record->point_radius       = 6;
        $record->point_image        = 'file1.png';
        $record->min_zoom           = 7;
        $record->max_zoom           = 8;
        $record->map_active         = 1;
        $record->map_focus          = 'center1';
        $record->map_zoom           = 9;

        // Save.
        $record->save('POINT(1 2)');

        // Build the record array.
        $records = $this->_recordsTable->queryRecord($record->id);

        // Check result.
        $this->assertEquals(
            $records, array(
                'id'                => $record->id,
                'item_id'           => $item->id,
                'title'             => 'Title',
                'body'              => 'Body.',
                'slug'              => 'slug',
                'vector_color'      => '#1',
                'stroke_color'      => '#2',
                'select_color'      => '#3',
                'vector_opacity'    => 1,
                'select_opacity'    => 2,
                'stroke_opacity'    => 3,
                'image_opacity'     => 4,
                'stroke_width'      => 5,
                'point_radius'      => 6,
                'point_image'       => 'file1.png',
                'min_zoom'          => 7,
                'max_zoom'          => 8,
                'map_focus'         => 'center1',
                'map_zoom'          => 9,
                'coverage'          => 'POINT(1 2)',
                'wmsAddress'        => null,
                'layers'            => null,
                'map_active'        => 1
            )
        );

    }


}
