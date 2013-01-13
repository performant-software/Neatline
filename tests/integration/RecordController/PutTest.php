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
        $record->tags               = '4';
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

        $values = array(
            'title'                 => '20',
            'body'                  => '21',
            'slug'                  => '22',
            'vector_color'          => '23',
            'stroke_color'          => '24',
            'select_color'          => '25',
            'vector_opacity'        => '26',
            'select_opacity'        => '27',
            'stroke_opacity'        => '28',
            'image_opacity'         => '29',
            'stroke_width'          => '30',
            'point_radius'          => '31',
            'point_image'           => '32',
            'min_zoom'              => '33',
            'max_zoom'              => '34',
            'map_focus'             => '35',
            'map_zoom'              => '36',
            'coverage'              => 'POINT(37 37)'
        );

        $this->writePut($values);
        $this->dispatch('neatline/record/'.$record->id);

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Should update fields.
        $this->assertEquals($record->title,             '20');
        $this->assertEquals($record->body,              '21');
        $this->assertEquals($record->slug,              '22');
        $this->assertEquals($record->vector_color,      '23');
        $this->assertEquals($record->stroke_color,      '24');
        $this->assertEquals($record->select_color,      '25');
        $this->assertEquals($record->vector_opacity,    26);
        $this->assertEquals($record->select_opacity,    27);
        $this->assertEquals($record->stroke_opacity,    28);
        $this->assertEquals($record->image_opacity,     29);
        $this->assertEquals($record->stroke_width,      30);
        $this->assertEquals($record->point_radius,      31);
        $this->assertEquals($record->point_image,       '32');
        $this->assertEquals($record->min_zoom,          33);
        $this->assertEquals($record->max_zoom,          34);
        $this->assertEquals($record->map_focus,         '35');
        $this->assertEquals($record->map_zoom,          36);
        $this->assertEquals($record->coverage,          'POINT(37 37)');

    }


}
