<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Field set/get tests for NeatlineExhibit.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlineExhibitTest_FieldAccess
    extends Neatline_Test_AppTestCase
{


    /**
     * Test field set and get.
     */
    public function testFieldAccess()
    {

        // Create exhibit.
        $exhibit = new NeatlineExhibit();

        // Set.
        $exhibit->creator_id    = 1;
        $exhibit->tag_id        = 2;
        $exhibit->title         = 'Title';
        $exhibit->description   = 'Description.';
        $exhibit->slug          = 'slug';
        $exhibit->public        = 3;
        $exhibit->query         = 'query';
        $exhibit->map_focus     = 'CENTER()';
        $exhibit->map_zoom      = 4;
        $exhibit->save();

        // Re-get the exhibit object.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Get.
        $this->assertNotNull($exhibit->added);
        $this->assertNotNull($exhibit->modified);
        $this->assertEquals($exhibit->creator_id, 1);
        $this->assertEquals($exhibit->tag_id, 2);
        $this->assertEquals($exhibit->title, 'Title');
        $this->assertEquals($exhibit->description, 'Description.');
        $this->assertEquals($exhibit->slug, 'slug');
        $this->assertEquals($exhibit->query, 'query');
        $this->assertEquals($exhibit->public, 3);
        $this->assertEquals($exhibit->map_focus, 'CENTER()');
        $this->assertEquals($exhibit->map_zoom, 4);

    }


}
