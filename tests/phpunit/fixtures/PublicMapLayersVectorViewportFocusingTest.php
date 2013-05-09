<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_PublicMapLayersVectorViewportFocusing
    extends Neatline_FixtureCase
{


    /**
     * `PublicMapLayersVectorViewportFocusing.records.json`
     */
    public function testRecords()
    {

        $record = $this->__record($this->exhibit);

        $record->setArray(array(
            'map_focus' => '100,200',
            'map_zoom'  => 10
        ));

        $record->save();

        $this->writeFixtureFromRoute('neatline/records',
            'PublicMapLayersVectorViewportFocusing.records.json'
        );

    }


}
