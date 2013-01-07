<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * Test field set/get.
     * --------------------------------------------------------------------
     */
    public function testFieldAccess()
    {

        // Create a record.
        $record = $this->__record();

        $record->item_id      = 1;
        $record->exhibit_id   = 2;
        $record->tag_id       = 3;
        $record->slug         = '4';
        $record->title        = '5';
        $record->body         = '6';
        $record->tags         = '7';
        $record->coverage     = 'POINT(1 1)';
        $record->map_active   = 8;
        $record->map_focus    = '9';
        $record->map_zoom     = 10;
        $record->save();

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Data fields:
        $this->assertEquals($record->item_id,       1);
        $this->assertEquals($record->exhibit_id,    2);
        $this->assertEquals($record->tag_id,        3);
        $this->assertEquals($record->slug,          '4');
        $this->assertEquals($record->title,         '5');
        $this->assertEquals($record->body,          '6');
        $this->assertEquals($record->tags,          '7');
        $this->assertEquals($record->map_active,    8);
        $this->assertEquals($record->map_focus,     '9');
        $this->assertEquals($record->map_zoom,      10);

        // Check the coverage value.
        $this->assertEquals($this->getCoverageAsText($record),
            'POINT(1 1)'
        );

    }


    /**
     * --------------------------------------------------------------------
     * Test style set/get.
     * --------------------------------------------------------------------
     */
    public function testStyleAccess()
    {

        // print_r($this->db->describeTable('omeka_neatline_records'));

        // Create a record.
        $record = $this->__record();

        $record->setStyle('vector_color',     '1');
        $record->setStyle('stroke_color',     '2');
        $record->setStyle('select_color',     '3');
        $record->setStyle('vector_opacity',   4);
        $record->setStyle('select_opacity',   5);
        $record->setStyle('stroke_opacity',   6);
        $record->setStyle('image_opacity',    7);
        $record->setStyle('stroke_width',     8);
        $record->setStyle('point_radius',     9);
        $record->setStyle('point_image',      '10');
        $record->setStyle('max_zoom',         11);
        $record->setStyle('min_zoom',         12);
        $record->save();

        // Reload the record.
        $record = $this->_recordsTable->find($record->id);

        // Local styles:
        $this->assertEquals($record->getStyle('vector_color'),    '1');
        $this->assertEquals($record->getStyle('stroke_color'),    '2');
        $this->assertEquals($record->getStyle('select_color'),    '3');
        $this->assertEquals($record->getStyle('vector_opacity'),  4);
        $this->assertEquals($record->getStyle('select_opacity'),  5);
        $this->assertEquals($record->getStyle('stroke_opacity'),  6);
        $this->assertEquals($record->getStyle('image_opacity'),   7);
        $this->assertEquals($record->getStyle('stroke_width'),    8);
        $this->assertEquals($record->getStyle('point_radius'),    9);
        $this->assertEquals($record->getStyle('point_image'),     '10');
        $this->assertEquals($record->getStyle('max_zoom'),        11);
        $this->assertEquals($record->getStyle('min_zoom'),        12);

    }


}
