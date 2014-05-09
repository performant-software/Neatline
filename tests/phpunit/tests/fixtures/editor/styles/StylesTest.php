<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorStyles extends Neatline_Case_Fixture
{


    public function testExhibit()
    {

        $exhibit = $this->_exhibit();
        $exhibit->styles    = '1';
        $exhibit->map_focus = '2';
        $exhibit->map_zoom  = '3';
        $exhibit->save();

        $this->_writeFixtureFromRoute('neatline/exhibits/'.$exhibit->id,
            'EditorStyles.json'
        );

    }


}
