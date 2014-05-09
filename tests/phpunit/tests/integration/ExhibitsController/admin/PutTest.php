<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
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
            'item_query'        => '1',
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
            'item_query'        => '2',
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

        $this->assertEquals(1,      $exhibit->public);
        $this->assertEquals('2',    $exhibit->item_query);
        $this->assertEquals('3',    $exhibit->spatial_layers);
        $this->assertEquals('4',    $exhibit->spatial_layer);
        $this->assertEquals('5',    $exhibit->widgets);
        $this->assertEquals('6',    $exhibit->title);
        $this->assertEquals('7',    $exhibit->slug);
        $this->assertEquals('8',    $exhibit->narrative);
        $this->assertEquals('9',    $exhibit->styles);
        $this->assertEquals('10',   $exhibit->map_focus);
        $this->assertEquals(11,     $exhibit->map_zoom);

    }


    /**
     * PUT should propagate the exhibit stylesheet.
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
        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $record = $this->_reload($record);

        // `styles` should be updated.
        $this->assertEquals('color', $record->fill_color);

    }


    /**
     * PUT should respond with all exhibit attributes.
     */
    public function testResponse()
    {

        $exhibit = $this->_exhibit();

        $this->_setPut();
        $this->dispatch('neatline/exhibits/'.$exhibit->id);
        $json = $this->_getResponseArray();

        // Should emit correct record.
        $this->assertEquals($exhibit->id, $json['id']);

        // Should emit all attributes.
        foreach (array_keys($exhibit->toArray()) as $k) {
            $this->assertArrayHasKey($k, $json);
        }

    }


}
