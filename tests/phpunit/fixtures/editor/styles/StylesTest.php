<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorStyles extends Neatline_Case_Fixture
{


    public function testExhibit()
    {

        $exhibit = $this->__exhibit();
        $exhibit->styles    = '1';
        $exhibit->map_focus = '2';
        $exhibit->map_zoom  = '3';
        $exhibit->save();

        $this->writeFixtureFromRoute('neatline/exhibits/'.$exhibit->id,
            'EditorStyles.exhibit.json'
        );

    }


}
