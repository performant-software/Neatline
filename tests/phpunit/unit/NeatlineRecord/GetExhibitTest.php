<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlineRecordTest_GetExhibit extends Neatline_DefaultCase
{


    /**
     * `getExhibit` should return the parent exhibit.
     */
    public function testGetExhibit()
    {

        $exhibit    = $this->__exhibit();
        $record     = new NeatlineRecord($exhibit);

        $retrieved = $record->getExhibit();
        $this->assertEquals($exhibit->id, $retrieved->id);

    }


}
