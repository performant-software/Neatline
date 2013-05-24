<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapWmsFocusing extends Neatline_Case_Fixture
{


    /**
     * `PublicMapLayersWmsViewportFocusing.noFocus.json`
     * `PublicMapLayersWmsViewportFocusing.focus.json`
     */
    public function testFocusing()
    {

        $record = new NeatlineRecord();

        $record->setArray(array(
            'wms_address' => 'address',
            'wms_layers'  => 'layers'
        ));

        $record->save();

        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'PublicMapWmsFocusing.noFocus.json'
        );

        $record->setArray(array(
            'map_focus' => '100,200',
            'map_zoom'  => 10
        ));

        $record->save();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records/'.$record->id,
            'PublicMapWmsFocusing.focus.json'
        );

    }


}
