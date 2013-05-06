<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Get extends Neatline_TestCase
{


    /**
     * GET should emit a JSON representation of a exhibit.
     */
    public function testGet()
    {

        $exhibit = $this->__exhibit();

        $exhibit->setArray(array(
            'public'        => 1,
            'query'         => '2',
            'base_layers'   => '3',
            'base_layer'    => '4',
            'widgets'       => '5',
            'title'         => '6',
            'slug'          => '7',
            'narrative'     => '8',
            'styles'        => '9',
            'map_focus'     => '10',
            'map_zoom'      => 11
        ));

        $exhibit->save();

        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $response = $this->getResponseArray();

        $this->assertEquals($response->public,          1);
        $this->assertEquals($response->query,           '2');
        $this->assertEquals($response->base_layers,     '3');
        $this->assertEquals($response->base_layer,      '4');
        $this->assertEquals($response->widgets,         '5');
        $this->assertEquals($response->title,           '6');
        $this->assertEquals($response->slug,            '7');
        $this->assertEquals($response->narrative,       '8');
        $this->assertEquals($response->styles,          '9');
        $this->assertEquals($response->map_focus,       '10');
        $this->assertEquals($response->map_zoom,        11);

    }


}
