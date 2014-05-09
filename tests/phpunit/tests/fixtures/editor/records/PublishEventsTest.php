<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class FixturesTest_EditorRecordsPublishEvents extends Neatline_Case_Fixture
{


    public function testRecords()
    {

        $record = $this->_record($this->exhibit);
        $record->title = 'title';
        $record->body  = 'body';
        $record->save();

        $this->_writeRecordsApiFixture($this->exhibit,
            'EditorRecordsPublishEvents.json'
        );

    }


}
