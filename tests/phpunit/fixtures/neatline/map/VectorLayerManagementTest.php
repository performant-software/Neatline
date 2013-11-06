<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapVectorLayerManagement
    extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);
        $record4 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record4->title     = 'title4';
        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';
        $record3->coverage  = 'POINT(0 3)';
        $record4->coverage  = 'POINT(0 4)';
        $record1->added     = '2004-01-01';
        $record2->added     = '2003-01-01';
        $record3->added     = '2002-01-01';
        $record4->added     = '2001-01-01';

        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // Match records 1-3.
        // --------------------------------------------------------------------

        $this->request->setQuery(array(
            'extent' => 'LINESTRING(0 1,0 3)'
        ));

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapVectorLayerManagement.123.json'
        );

        // Match records 3 and 4, with 1-3 already loaded.
        // --------------------------------------------------------------------

        $this->request->setQuery(array(
            'existing'  => array($record1->id, $record2->id, $record3->id),
            'extent'    => 'LINESTRING(0 3,0 4)'
        ));

        $this->_writeFixtureFromRoute('neatline/records',
            'NeatlineMapVectorLayerManagement.34.json'
        );

    }


}
