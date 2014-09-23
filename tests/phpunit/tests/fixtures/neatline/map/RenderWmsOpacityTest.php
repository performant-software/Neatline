<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineRenderMapWmsOpacity extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record = $this->_record($this->exhibit);

        $record->setArray(array(
            'wms_address'   => 'address',
            'wms_layers'    => 'layers',
            'fill_opacity'  => 0.5,
            'fill_opacity_select' => 0.8
        ));

        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapRenderWmsOpacity.json'
        );

    }


}
