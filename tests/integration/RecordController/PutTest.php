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

        $record->item_id            = '1';
        $record->title              = '2';
        $record->body               = '3';
        $record->slug               = '4';
        $record->svg                = '5';
        $record->tags               = '6';
        $record->vector_color       = '7';
        $record->stroke_color       = '8';
        $record->select_color       = '9';
        $record->vector_opacity     = 10;
        $record->select_opacity     = 11;
        $record->stroke_opacity     = 12;
        $record->image_opacity      = 13;
        $record->stroke_width       = 14;
        $record->point_radius       = 15;
        $record->point_image        = '16';
        $record->min_zoom           = 17;
        $record->max_zoom           = 18;
        $record->map_focus          = '19';
        $record->map_zoom           = 20;
        $record->coverage           = 'POINT(21 21)';
        $record->save();

        $values = array(
            'title'                 => '22',
            'body'                  => '23',
            'slug'                  => '24',
            'svg'                   => '25',
            'vector_color'          => '26',
            'stroke_color'          => '27',
            'select_color'          => '28',
            'vector_opacity'        => '29',
            'select_opacity'        => '30',
            'stroke_opacity'        => '31',
            'image_opacity'         => '32',
            'stroke_width'          => '33',
            'point_radius'          => '34',
            'point_image'           => '35',
            'min_zoom'              => '36',
            'max_zoom'              => '37',
            'map_focus'             => '38',
            'map_zoom'              => '39',
            'coverage'              => 'POINT(40 40)'
        );

        $this->writePut($values);
        $this->dispatch('neatline/record/'.$record->id);

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Should update fields.
        $this->assertEquals($record->title,             '22');
        $this->assertEquals($record->body,              '23');
        $this->assertEquals($record->slug,              '24');
        $this->assertEquals($record->svg,               '25');
        $this->assertEquals($record->vector_color,      '26');
        $this->assertEquals($record->stroke_color,      '27');
        $this->assertEquals($record->select_color,      '28');
        $this->assertEquals($record->vector_opacity,    29);
        $this->assertEquals($record->select_opacity,    30);
        $this->assertEquals($record->stroke_opacity,    31);
        $this->assertEquals($record->image_opacity,     32);
        $this->assertEquals($record->stroke_width,      33);
        $this->assertEquals($record->point_radius,      34);
        $this->assertEquals($record->point_image,       '35');
        $this->assertEquals($record->min_zoom,          36);
        $this->assertEquals($record->max_zoom,          37);
        $this->assertEquals($record->map_focus,         '38');
        $this->assertEquals($record->map_zoom,          39);
        $this->assertEquals($record->coverage,          'POINT(40 40)');

    }


    /**
     * PUT should synchronize record styles with tag siblings.
     */
    public function testSynchronizeStyles()
    {

        $exhibit = $this->__exhibit();
        $record1 = new NeatlineRecord($exhibit);
        $record2 = new NeatlineRecord($exhibit);
        $record1->tags = 'tag';
        $record2->tags = 'tag';
        $record1->save();
        $record2->save();

        // Exhibit YAML.
        $exhibit->styles = "
        tag:
         - vector_color
        ";

        $exhibit->save();

        // Save the record.
        $this->writePut(array('vector_color' => 'color'));
        $this->dispatch('neatline/record/'.$record1->id);

        // Record 2 should be synchronized with record 1.
        $record2 = $this->_recordsTable->find($record2->id);
        $this->assertEquals($record2->vector_color, 'color');

    }


}
