<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapWmsLayerManagement extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);
        $record4 = $this->_record($this->exhibit);

        $record1->title         = 'title1';
        $record2->title         = 'title2';
        $record3->title         = 'title3';
        $record4->title         = 'title4';
        $record1->wms_address   = 'address1';
        $record2->wms_address   = 'address2';
        $record3->wms_address   = 'address3';
        $record1->wms_layers    = 'layers1';
        $record2->wms_layers    = 'layers2';
        $record3->wms_layers    = 'layers3';
        $record1->added         = '2004-01-01';
        $record2->added         = '2003-01-01';
        $record3->added         = '2002-01-01';
        $record4->added         = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapWmsLayerManagement.regular.json'
        );

        $record3->delete();

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapWmsLayerManagement.deleted.json'
        );

    }


}
