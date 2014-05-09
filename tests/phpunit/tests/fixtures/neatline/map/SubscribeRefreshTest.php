<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapSubscribeRefresh extends Neatline_Case_Fixture
{


    public function testVectorRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record3->coverage  = 'POINT(5 6)';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapSubscribeRefresh.vector.original.json'
        );

        $record1->coverage  = 'POINT(7 8)';
        $record2->coverage  = 'POINT(9 10)';
        $record3->coverage  = 'POINT(11 12)';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapSubscribeRefresh.vector.changed.json'
        );

    }


    public function testWmsRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title         = 'title1';
        $record2->title         = 'title2';
        $record3->title         = 'title3';
        $record1->wms_address   = 'address1';
        $record2->wms_address   = 'address2';
        $record3->wms_address   = 'address3';
        $record1->wms_layers    = 'layers1';
        $record2->wms_layers    = 'layers2';
        $record3->wms_layers    = 'layers3';
        $record1->added         = '2003-01-01';
        $record2->added         = '2002-01-01';
        $record3->added         = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapSubscribeRefresh.wms.original.json'
        );

        $record1->wms_address   = 'address4';
        $record2->wms_address   = 'address5';
        $record3->wms_address   = 'address6';
        $record1->wms_layers    = 'layers4';
        $record2->wms_layers    = 'layers5';
        $record3->wms_layers    = 'layers6';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapSubscribeRefresh.wms.changed.json'
        );

    }


}
