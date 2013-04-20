<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Map Edit Layer" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_MapEditLayer extends Neatline_FixtureCase
{


    /**
     * `MapEditLayer.records.regular.json`
     * `MapEditLayer.records.deleted.json`
     */
    public function testMapEditLayer()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);
        $record3 = $this->__record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record3->title     = 'title3';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record3->coverage  = 'POINT(5 6)';

        $record1->save();
        $record2->save();
        $record3->save();

        $this->writeFixtureFromRoute('neatline/records',
            'MapEditLayer.records.regular.json'
        );

        $record3->delete();

        $this->resetResponse();
        $this->writeFixtureFromRoute('neatline/records',
            'MapEditLayer.records.deleted.json'
        );

    }


}
