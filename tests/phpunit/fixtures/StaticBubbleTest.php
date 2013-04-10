<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Static Bubble" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_StaticBubble extends Neatline_RecordsFixtureCase
{


    /**
     * `StaticBubble.records.json`
     */
    public function testStaticBubble()
    {

        $record1 = $this->__record($this->exhibit);
        $record2 = $this->__record($this->exhibit);

        $record1->title = 'title1';
        $record2->title = 'title2';
        $record1->body = 'body1';
        $record2->body = 'body2';
        $record1->coverage = 'POINT(1 2)';
        $record2->coverage = 'POINT(3 4)';

        $record1->save();
        $record2->save();

        $this->writeFixtureFromRoute('neatline/records',
            'StaticBubble.records.json'
        );

    }


}
