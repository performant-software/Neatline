<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorMapRemoveEditLayer extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);
        $record3 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->coverage  = 'POINT(0 1)';
        $record2->coverage  = 'POINT(0 2)';
        $record3->coverage  = 'POINT(0 3)';

        $record1->save();
        $record2->save();
        $record3->save();

        // Match records 1-3.
        // --------------------------------------------------------------------

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapRemoveEditLayer.records123.json'
        );

        // Match just records 1-2, with 1-3 already loaded.
        // --------------------------------------------------------------------

        $this->request->setQuery(array(
            'extent'    => 'LINESTRING(0 1,0 2)',
            'existing'  => array($record1->id, $record2->id, $record3->id)
        ));

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorMapRemoveEditLayer.records12.json'
        );

    }


}
