<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapDefaultFocus extends Neatline_Case_Default
{


    protected $_isAdminTest = false;


    public function testExhibit()
    {

        $exhibit = $this->_exhibit();
        $exhibit->spatial_layer = 'OpenStreetMap';
        $exhibit->map_focus = '1,2';
        $exhibit->map_zoom = 10;
        $exhibit->save();

        $this->_writeExhibitMarkupFixture($exhibit,
            'NeatlineMapDefaultFocus.html'
        );

    }


}
