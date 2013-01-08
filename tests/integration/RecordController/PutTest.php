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
     * --------------------------------------------------------------------
     * PUT should update a record.
     * --------------------------------------------------------------------
     */
    public function testPut()
    {

        // Create record.
        $record = $this->__record();

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
        $record->coverage           = 'POINT(16 16)';
        $record->map_active         = 0;
        $record->map_focus          = '17';
        $record->map_zoom           = 18;
        $record->save();

        // Mock values.
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
            'map_active'            => '1',
            'map_focus'             => '35',
            'map_zoom'              => '36',
            'coverage'              => 'POINT(37 37)'
        );

        // Issue request.
        $this->writePut($values);
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/record/'.$record->id);

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Check updated fields:
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
        $this->assertEquals($record->map_active,        1);
        $this->assertEquals($record->map_focus,         '35');
        $this->assertEquals($record->map_zoom,          36);
        $this->assertEquals($record->coverage,          'POINT(37 37)');

    }


}
