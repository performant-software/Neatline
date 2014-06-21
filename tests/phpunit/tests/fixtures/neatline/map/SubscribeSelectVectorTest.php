<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_NeatlineMapSubscribeSelectVector
    extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $noFocusNoZoom = $this->_record($this->exhibit);

        $noFocusNoZoom->setArray(array(
            'coverage' => 'POINT(1 2)'
        ));

        $noFocusNoZoom->save();

        $this->_writeRecordApiFixture($noFocusNoZoom,
            'NeatlineMapSubscribeSelectVector.noFocusNoZoom.json'
        );

        // --------------------------------------------------------------------

        $focusNoZoom = $this->_record($this->exhibit);

        $focusNoZoom->setArray(array(
            'coverage'  => 'POINT(3 4)',
            'map_focus' => '100,200'
        ));

        $focusNoZoom->save();

        $this->_writeRecordApiFixture($focusNoZoom,
            'NeatlineMapSubscribeSelectVector.focusNoZoom.json'
        );

        // --------------------------------------------------------------------

        $zoomNoFocus = $this->_record($this->exhibit);

        $zoomNoFocus->setArray(array(
            'coverage'  => 'POINT(5 6)',
            'map_zoom'  => '10'
        ));

        $zoomNoFocus->save();

        $this->_writeRecordApiFixture($zoomNoFocus,
            'NeatlineMapSubscribeSelectVector.zoomNoFocus.json'
        );

        // --------------------------------------------------------------------

        $focusAndZoom = $this->_record($this->exhibit);

        $focusAndZoom->setArray(array(
            'coverage'  => 'POINT(7 8)',
            'map_focus' => '100,200',
            'map_zoom'  => '10'
        ));

        $focusAndZoom->save();

        $this->_writeRecordApiFixture($focusAndZoom,
            'NeatlineMapSubscribeSelectVector.focusAndZoom.json'
        );

        // --------------------------------------------------------------------

        $this->_writeRecordsApiFixture($this->exhibit,
            'NeatlineMapSubscribeSelectVector.records.json'
        );

    }


}
