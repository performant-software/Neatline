<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_GetExhibit extends Neatline_Case_Default
{


    /**
     * `getExhibit` should return the parent exhibit.
     */
    public function testGetExhibit()
    {

        $exhibit    = $this->_exhibit();
        $record     = new NeatlineRecord($exhibit);

        $retrieved = $record->getExhibit();
        $this->assertEquals($exhibit->id, $retrieved->id);

    }


}
