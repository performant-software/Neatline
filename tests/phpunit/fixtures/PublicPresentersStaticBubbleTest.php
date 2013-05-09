<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicPresentersStaticBubble
    extends Neatline_FixtureCase
{


    /**
     * `PublicPresentersStaticBubble.records.json`
     */
    public function testRecords()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);

        $record1->title     = 'title1';
        $record2->title     = 'title2';
        $record1->body      = 'body1';
        $record2->body      = 'body2';
        $record1->presenter = 'StaticBubble';
        $record2->presenter = 'StaticBubble';
        $record1->coverage  = 'POINT(1 2)';
        $record2->coverage  = 'POINT(3 4)';
        $record1->added     = '2003-01-01';
        $record2->added     = '2002-01-01';

        $record1->save();
        $record2->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicPresentersStaticBubble.records.json'
        );

    }


}
