<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminGet extends Neatline_Case_Default
{


    /**
     * GET should emit a JSON representation of a exhibit.
     */
    public function testGet()
    {

        $exhibit = $this->_exhibit();

        $exhibit->setArray(array(
            'public'            => 1,
            'item_query'        => '2',
            'spatial_layers'    => '3',
            'spatial_layer'     => '4',
            'widgets'           => '5',
            'title'             => '6',
            'slug'              => '7',
            'narrative'         => '8',
            'styles'            => '9',
            'map_focus'         => '10',
            'map_zoom'          => 11
        ));

        $exhibit->save();

        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $json = $this->_getResponseArray();

        $this->assertEquals(1,      $json['public']);
        $this->assertEquals('2',    $json['item_query']);
        $this->assertEquals('3',    $json['spatial_layers']);
        $this->assertEquals('4',    $json['spatial_layer']);
        $this->assertEquals('5',    $json['widgets']);
        $this->assertEquals('6',    $json['title']);
        $this->assertEquals('7',    $json['slug']);
        $this->assertEquals('8',    $json['narrative']);
        $this->assertEquals('9',    $json['styles']);
        $this->assertEquals('10',   $json['map_focus']);
        $this->assertEquals(11,     $json['map_zoom']);

    }


}
