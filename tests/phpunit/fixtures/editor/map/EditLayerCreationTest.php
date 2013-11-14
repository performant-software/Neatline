<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorMapStartEdit extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record1 = $this->_record($this->exhibit);
        $record2 = $this->_record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';

        $record1->save();
        $record2->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorMapEditLayerCreation.records12.json'
        );

        $record3 = $this->_record($this->exhibit);
        $record3->title     = 'title3';
        $record3->coverage  = 'POINT(5 6)';
        $record3->save();

        $this->_writeFixtureFromRoute('neatline/records',
            'EditorMapEditLayerCreation.records123.json'
        );

        $this->resetRequest();
        $this->_writeFixtureFromRoute('neatline/records/'.$record3->id,
            'EditorMapEditLayerCreation.record3.json'
        );

    }


}
