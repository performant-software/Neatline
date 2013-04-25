<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTableTest_QueryRecord extends Neatline_TestCase
{


    /**
     * `queryRecord` should fetch an individual record.
     */
    public function testQueryRecord()
    {

        $exhibit  = $this->__exhibit();
        $item     = $this->__item();
        $record   = $this->__record($exhibit, $item);

        $record->setArray(array(
            'title'             => '1',
            'body'              => '2',
            'coverage'          => 'POINT(3 3)',
            'tags'              => '4',
            'widgets'           => '5',
            'presenter'         => '6',
            'fill_color'        => '7',
            'select_color'      => '8',
            'stroke_color'      => '9',
            'fill_opacity'      => 10,
            'select_opacity'    => 11,
            'stroke_opacity'    => 12,
            'stroke_width'      => 13,
            'point_radius'      => 14,
            'point_image'       => '15',
            'min_zoom'          => 16,
            'max_zoom'          => 17,
            'map_zoom'          => 18,
            'map_focus'         => '19',
            'wms_address'       => '20',
            'wms_layers'        => '21',
            'start_date'        => '22',
            'end_date'          => '23',
            'show_after_date'   => '24',
            'show_before_date'  => '25',
            'weight'            => 26
        ));

        $record->__save();
        $result = $this->__records->queryRecord($record->id);

        $this->assertEquals($result['id'],                  $record->id);
        $this->assertEquals($result['item_id'],             $item->id);
        $this->assertEquals($result['title'],                '1');
        $this->assertEquals($result['body'],                '2');
        $this->assertEquals($result['coverage'],            'POINT(3 3)');
        $this->assertEquals($result['tags'],                '4');
        $this->assertEquals($result['widgets'],             '5');
        $this->assertEquals($result['presenter'],           '6');
        $this->assertEquals($result['fill_color'],          '7');
        $this->assertEquals($result['select_color'],        '8');
        $this->assertEquals($result['stroke_color'],        '9');
        $this->assertEquals($result['fill_opacity'],        10);
        $this->assertEquals($result['select_opacity'],      11);
        $this->assertEquals($result['stroke_opacity'],      12);
        $this->assertEquals($result['stroke_width'],        13);
        $this->assertEquals($result['point_radius'],        14);
        $this->assertEquals($result['point_image'],         '15');
        $this->assertEquals($result['min_zoom'],            16);
        $this->assertEquals($result['max_zoom'],            17);
        $this->assertEquals($result['map_zoom'],            18);
        $this->assertEquals($result['map_focus'],           '19');
        $this->assertEquals($result['wms_address'],        '20');
        $this->assertEquals($result['wms_layers'],         '21');
        $this->assertEquals($result['start_date'],          '22');
        $this->assertEquals($result['end_date'],            '23');
        $this->assertEquals($result['show_after_date'],     '24');
        $this->assertEquals($result['show_before_date'],    '25');
        $this->assertEquals($result['weight'],              26);

    }


}
