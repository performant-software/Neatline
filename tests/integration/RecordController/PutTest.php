<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for PUT action in records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordControllerTest_Put
    extends Neatline_Test_AppTestCase
{


    /**
     * PUT should update a record.
     */
    public function testPut()
    {

        $record = $this->__record();

        $record->title              = '1';
        $record->body               = '2';
        $record->slug               = '3';
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
        $record->map_focus          = '16';
        $record->map_zoom           = 17;
        $record->coverage           = 'POINT(18 18)';
        $record->save();

        $values = array(
            'title'                 => '19',
            'body'                  => '20',
            'slug'                  => '21',
            'vector_color'          => '22',
            'stroke_color'          => '23',
            'select_color'          => '24',
            'vector_opacity'        => '25',
            'select_opacity'        => '26',
            'stroke_opacity'        => '27',
            'image_opacity'         => '28',
            'stroke_width'          => '29',
            'point_radius'          => '30',
            'point_image'           => '31',
            'min_zoom'              => '32',
            'max_zoom'              => '33',
            'map_focus'             => '34',
            'map_zoom'              => '35',
            'coverage'              => 'POINT(36 36)'
        );

        $this->writePut($values);
        $this->dispatch('neatline/record/'.$record->id);

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Should update fields.
        $this->assertEquals($record->title,             '19');
        $this->assertEquals($record->body,              '20');
        $this->assertEquals($record->slug,              '21');
        $this->assertEquals($record->vector_color,      '22');
        $this->assertEquals($record->stroke_color,      '23');
        $this->assertEquals($record->select_color,      '24');
        $this->assertEquals($record->vector_opacity,    25);
        $this->assertEquals($record->select_opacity,    26);
        $this->assertEquals($record->stroke_opacity,    27);
        $this->assertEquals($record->image_opacity,     28);
        $this->assertEquals($record->stroke_width,      29);
        $this->assertEquals($record->point_radius,      30);
        $this->assertEquals($record->point_image,       '31');
        $this->assertEquals($record->min_zoom,          32);
        $this->assertEquals($record->max_zoom,          33);
        $this->assertEquals($record->map_focus,         '34');
        $this->assertEquals($record->map_zoom,          35);
        $this->assertEquals($record->coverage,          'POINT(36 36)');

    }


}
