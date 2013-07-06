<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminPut extends Neatline_Case_Default
{


    /**
     * PUT should update an exhibit.
     */
    public function testUpdateExhibit()
    {

        $exhibit = $this->_exhibit();

        $exhibit->setArray(array(
            'public'            => 0,
            'query'             => '1',
            'spatial_layers'    => '2',
            'spatial_layer'     => '3',
            'widgets'           => '4',
            'title'             => '5',
            'slug'              => '6',
            'narrative'         => '7',
            'styles'            => '8',
            'map_focus'         => '9',
            'map_zoom'          => 10
        ));

        $exhibit->save();

        $this->_setPut(array(
            'public'            => '1',
            'query'             => '2',
            'spatial_layers'    => '3',
            'spatial_layer'     => '4',
            'widgets'           => '5',
            'title'             => '6',
            'slug'              => '7',
            'narrative'         => '8',
            'styles'            => '9',
            'map_focus'         => '10',
            'map_zoom'          => '11'
        ));

        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $exhibit = $this->_reload($exhibit);

        $this->assertEquals($exhibit->public,           1);
        $this->assertEquals($exhibit->query,            '2');
        $this->assertEquals($exhibit->spatial_layers,   '3');
        $this->assertEquals($exhibit->spatial_layer,    '4');
        $this->assertEquals($exhibit->widgets,          '5');
        $this->assertEquals($exhibit->title,            '6');
        $this->assertEquals($exhibit->slug,             '7');
        $this->assertEquals($exhibit->narrative,        '8');
        $this->assertEquals($exhibit->styles,           '9');
        $this->assertEquals($exhibit->map_focus,        '10');
        $this->assertEquals($exhibit->map_zoom,         11);

    }


    /**
     * The styles should be propagated.
     */
    public function testUpdateStyles()
    {

        $exhibit = $this->_exhibit();
        $record  = new NeatlineRecord($exhibit);
        $record->tags = 'tag1';
        $record->save();

        $values = array('styles' => "
            .tag1 {
              fill-color: color;
            }
        ");

        $this->_setPut($values);
        $this->dispatch('neatline/put/'.$exhibit->id);
        $record = $this->_reload($record);

        // `styles` should be updated.
        $this->assertEquals($record->fill_color, 'color');

    }


}
