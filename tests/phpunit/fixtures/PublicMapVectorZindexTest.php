<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapVectorZindex extends Neatline_FixtureCase
{


    /**
     * `PublicMapVectorZindex.records.json`
     */
    public function testZIndex()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record1->zindex    = 1;
        $record2->zindex    = 2;

        $record1->save();
        $record2->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapVectorZindex.records.json'
        );

    }


}
