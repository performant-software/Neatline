<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Map WMS Layers" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_MapWmsLayers extends Neatline_RecordsFixtureCase
{


    /**
     * `MapWmsLayers.records.regular.json`
     * `MapWmsLayers.records.deleted.json`
     */
    public function testLayerManagement()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);
        $record4 = $this->__record($this->exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record3->title = 'title3';
        $record4->title = 'title4';
        $record1->wms_address = 'address1';
        $record2->wms_address = 'address2';
        $record3->wms_address = 'address3';
        $record1->wms_layers = 'layers1';
        $record2->wms_layers = 'layers2';
        $record3->wms_layers = 'layers3';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        $this->writeFixtureFromRoute('neatline/records',
            'MapWmsLayers.records.regular.json'
        );

        $record3->delete();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'MapWmsLayers.records.deleted.json'
        );

    }


}
