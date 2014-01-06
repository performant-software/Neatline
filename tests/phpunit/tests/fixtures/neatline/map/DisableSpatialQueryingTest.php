<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapDisableSpatialQuerying
    extends Neatline_Case_Fixture
{


    protected $_isAdminTest = false;


    public function testExhibit()
    {

        $exhibit = $this->_exhibit();
        $exhibit->spatial_layer = 'OpenStreetMap';
        $exhibit->spatial_querying = 0;
        $exhibit->save();

        $this->_writeExhibitMarkupFixture($exhibit,
            'NeatlineMapDisableSpatialQuerying.html'
        );

    }


}
