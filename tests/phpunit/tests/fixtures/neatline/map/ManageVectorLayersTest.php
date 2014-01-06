<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapManageVectorLayers extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);
        $record4 = $this->_record($this->exhibit);
        $record5 = $this->_record($this->exhibit);
        $record6 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record4->title     = 'title4';
        $record5->title     = 'title5';
        $record6->title     = 'title6';
        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';
        $record3->coverage  = 'POINT(0 3)';
        $record4->coverage  = 'POINT(0 4)';
        $record5->coverage  = 'POINT(0 5)';
        $record6->coverage  = 'POINT(0 6)';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();
        $record5->save();
        $record6->save();

        // Match records 1-4.
        // --------------------------------------------------------------------

        $this->request->setQuery(array(
            'extent' => 'LINESTRING(0 1,0 4)'
        ));

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapManageVectorLayers.1234.json'
        );

        // Match records 3-6, with 1-4 already loaded.
        // --------------------------------------------------------------------

        $this->request->setQuery(array(
            'extent'    => 'LINESTRING(0 3,0 6)',
            'existing'  => array(
                $record1->id,
                $record2->id,
                $record3->id,
                $record4->id
            )
        ));

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapManageVectorLayers.3456.json'
        );

    }


}
