<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `update()` on NeatlineRecord.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineRecordTest_Update
    extends Neatline_Test_AppTestCase
{


    /**
     * update() should directly set all non-style values.
     *
     * @group tags
     */
    public function testUpdateNonStyleValues()
    {

        // Create record.
        $record = $this->__record();

        // Set:
        $record->slug               = 'slug';
        $record->title              = 'title';
        $record->body               = 'body';
        $record->tags               = 'tag1,tag2';
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 1;
        $record->map_active         = 2;

        // Mock values.
        $values = array(
            'id'                    => $record->id,
            'item_id'               => null,
            'slug'                  => 'slug2',
            'title'                 => 'title2',
            'body'                  => 'body2',
            'tags'                  => 'tag3,tag4',
            'map_focus'             => 'lat2/lon2',
            'coverage'              => 'POINT(1 1)',
            'map_zoom'              => 2,
            'map_active'            => 0
        );

        // Update, get record.
        $record->update($values);
        $record = $this->_recordsTable->find($record->id);

        // Check new values.
        $this->assertEquals($record->slug, 'slug2');
        $this->assertEquals($record->title, 'title2');
        $this->assertEquals($record->body, 'body2');
        $this->assertEquals($record->tags, 'tag3,tag4');
        $this->assertEquals($record->map_focus, 'lat2/lon2');
        $this->assertEquals($record->map_zoom, 2);
        $this->assertEquals($record->map_active, 0);
        $this->assertNotNull($record->coverage);

    }


    /**
     * .
     *
     * @group tags
     */
    public function testUpdateCreateLocalTag()
    {

    }


}
