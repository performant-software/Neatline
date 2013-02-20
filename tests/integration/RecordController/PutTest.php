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
        $record->coverage           = 'POINT(4 4)';
        $record->tags               = '5';
        $record->presenter          = '6';
        $record->vector_color       = '7';
        $record->stroke_color       = '8';
        $record->select_color       = '9';
        $record->vector_opacity     = 10;
        $record->select_opacity     = 11;
        $record->stroke_opacity     = 12;
        $record->stroke_width       = 13;
        $record->point_radius       = 14;
        $record->point_image        = '15';
        $record->min_zoom           = 16;
        $record->max_zoom           = 17;
        $record->map_focus          = '18';
        $record->map_zoom           = 19;
        $record->save();

        $values = array(
            'title'                 => '21',
            'body'                  => '22',
            'coverage'              => 'POINT(23 23)',
            'tags'                  => '24',
            'presenter'             => '25',
            'vector_color'          => '26',
            'stroke_color'          => '27',
            'select_color'          => '28',
            'vector_opacity'        => '29',
            'select_opacity'        => '30',
            'stroke_opacity'        => '31',
            'stroke_width'          => '32',
            'point_radius'          => '33',
            'point_image'           => '34',
            'min_zoom'              => '35',
            'max_zoom'              => '36',
            'map_focus'             => '37',
            'map_zoom'              => '38'
        );

        $this->writePut($values);
        $this->dispatch('neatline/record/'.$record->id);

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Should update fields.
        $this->assertEquals($record->title,             '21');
        $this->assertEquals($record->body,              '22');
        $this->assertEquals($record->coverage,          'POINT(23 23)');
        $this->assertEquals($record->tags,              '24');
        $this->assertEquals($record->presenter,         '25');
        $this->assertEquals($record->vector_color,      '26');
        $this->assertEquals($record->stroke_color,      '27');
        $this->assertEquals($record->select_color,      '28');
        $this->assertEquals($record->vector_opacity,    29);
        $this->assertEquals($record->select_opacity,    30);
        $this->assertEquals($record->stroke_opacity,    31);
        $this->assertEquals($record->stroke_width,      32);
        $this->assertEquals($record->point_radius,      33);
        $this->assertEquals($record->point_image,       '34');
        $this->assertEquals($record->min_zoom,          35);
        $this->assertEquals($record->max_zoom,          36);
        $this->assertEquals($record->map_focus,         '37');
        $this->assertEquals($record->map_zoom,          38);

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
