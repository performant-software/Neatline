<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordDeleteRecord extends Neatline_Case_Fixture
{


    public function testRecord()
    {

        $record = $this->_record($this->exhibit);

        $this->request->setMethod('DELETE');

        $this->_writeFixtureFromRoute('neatline/records/'.$record->id,
            'EditorRecordDeleteRecord.json'
        );

    }


}
