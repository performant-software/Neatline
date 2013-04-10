<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Fixture generator for "Map Cursor Events" Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_MapCursorEvents extends Neatline_TestCase
{


    protected $_isAdminTest = false;


    /**
     * `MapCursorEvents.records.json`
     */
    public function testMapCursorEvents()
    {

        $exhibit = $this->__exhibit();
        $record  = $this->__record($exhibit);
        $record->coverage = 'POINT(1 2)';
        $record->__save();

        $this->request->setQuery(array('exhibit_id' => $exhibit->id));

        $this->writeFixtureFromRoute('neatline/records',
            'MapCursorEvents.records.json');

    }


}
