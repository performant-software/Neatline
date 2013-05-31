<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapCursorInteractions
    extends Neatline_Case_Fixture
{


    /**
     * `PublicMapCursorInteractions.records.json`
     */
    public function testRecords()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);

        $record1->coverage = 'GEOMETRYCOLLECTION(POINT(1 2),POINT(3 4))';
        $record2->coverage = 'GEOMETRYCOLLECTION(POINT(5 6),POINT(7 8))';

        $record1->save();
        $record2->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapCursorInteractions.records.json'
        );

    }


}
