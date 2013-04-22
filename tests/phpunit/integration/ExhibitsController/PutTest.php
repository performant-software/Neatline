<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_Put extends Neatline_TestCase
{


    /**
     * PUT should update an exhibit.
     */
    public function testPut()
    {

        $exhibit = $this->__exhibit();

        $exhibit->styles    = '1';
        $exhibit->map_focus = '2';
        $exhibit->map_zoom  = 3;
        $exhibit->save();

        $values = array(
            'styles'        => '4',
            'map_focus'     => '5',
            'map_zoom'      => '6'
        );

        $this->writePut($values);
        $this->dispatch('neatline/put/'.$exhibit->id);
        $exhibit = $this->reload($exhibit);

        // Should update fields.
        $this->assertEquals($exhibit->styles,       '4');
        $this->assertEquals($exhibit->map_focus,    '5');
        $this->assertEquals($exhibit->map_zoom,     6);

    }


    /**
     * The styles should be propagated.
     */
    public function testUpdateStyles()
    {

        $exhibit = $this->__exhibit();
        $record  = new NeatlineRecord($exhibit);
        $record->tags = 'tag';
        $record->save();

        $values = array('styles' => "
            .tag {
              fill-color: color;
            }
        ");

        $this->writePut($values);
        $this->dispatch('neatline/put/'.$exhibit->id);

        // `styles` column should be updated.
        $record = $this->__records->find($record->id);
        $this->assertEquals($record->fill_color, 'color');

    }


}
