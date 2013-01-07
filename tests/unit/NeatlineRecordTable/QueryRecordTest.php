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
     * --------------------------------------------------------------------
     * queryRecord() should retrieve the data record with a given id and
     * construct an associative array that contains all of the information
     * about the record needed by the front end application.
     * --------------------------------------------------------------------
     */
    public function testQueryRecord()
    {

        // Create exhibit and item.
        $exhibit = $this->__exhibit();
        $item = $this->__item();

        // Create record.
        $record = new NeatlineRecord($exhibit, $item);

        // Text:
        $record->title              = '1';
        $record->body               = '2';
        $record->tags               = '3';
        $record->slug               = '4';

        // Styles:
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

        // Spatial:
        $record->map_active         = 0;
        $record->map_focus          = '17';
        $record->map_zoom           = 18;
        $record->coverage           = 'POINT(1 1)';

        // Save.
        $record->save();

        // Build the record array.
        $records = $this->_recordsTable->queryRecord($record->id);

        // Check result.
        $this->assertEquals($records['id'],                 $record->id);
        $this->assertEquals($records['item_id'],            $item->id);
        $this->assertEquals($records['title'],              '1');
        $this->assertEquals($records['body'],               '2');
        $this->assertEquals($records['tags'],               '3');
        $this->assertEquals($records['slug'],               '4');
        $this->assertEquals($records['vector_color'],       '5');
        $this->assertEquals($records['stroke_color'],       '6');
        $this->assertEquals($records['select_color'],       '7');
        $this->assertEquals($records['vector_opacity'],     8);
        $this->assertEquals($records['select_opacity'],     9);
        $this->assertEquals($records['stroke_opacity'],     10);
        $this->assertEquals($records['image_opacity'],      11);
        $this->assertEquals($records['stroke_width'],       12);
        $this->assertEquals($records['point_radius'],       13);
        $this->assertEquals($records['point_image'],        '14');
        $this->assertEquals($records['min_zoom'],           15);
        $this->assertEquals($records['max_zoom'],           16);
        $this->assertEquals($records['map_active'],         0);
        $this->assertEquals($records['map_focus'],          '17');
        $this->assertEquals($records['map_zoom'],           18);
        $this->assertEquals($records['coverage'],           'POINT(1 1)');

    }


}
