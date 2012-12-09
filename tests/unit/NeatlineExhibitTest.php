<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Exhibit row tests.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_NeatlineExhibitTest extends Neatline_Test_AppTestCase
{

    /**
     * Test get and set on columns.
     *
     * @return void.
     */
    public function testAttributeAccess()
    {

        // Create a record, capture time.
        $exhibit = new NeatlineExhibit();

        // Set.
        $exhibit->title =                   'title';
        $exhibit->description =             'Description.';
        $exhibit->slug =                    'slug';
        $exhibit->public =                  1;
        $exhibit->query =                   'query';
        $exhibit->map_focus =              'CENTER()';
        $exhibit->map_zoom =                1;
        $exhibit->save();

        // Re-get the exhibit object.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Get.
        $this->assertNotNull($exhibit->added);
        $this->assertNotNull($exhibit->modified);
        $this->assertEquals($exhibit->query, 'query');
        $this->assertEquals($exhibit->title, 'title');
        $this->assertEquals($exhibit->description, 'Description.');
        $this->assertEquals($exhibit->slug, 'slug');
        $this->assertEquals($exhibit->public, 1);
        $this->assertEquals($exhibit->map_focus, 'CENTER()');
        $this->assertEquals($exhibit->map_zoom, 1);

    }

    /**
     * saveForm() should save all key=>value pairs in the form data.
     *
     * @return void.
     */
    public function testSaveForm()
    {

        // Create an exhibit and map.
        $exhibit = $this->__exhibit();

        // Save form data.
        $exhibit->saveForm(array(
            'title' => 'Form Title',
            'description' => 'Form description.',
            'slug' => 'form-slug',
            'public' => 1
        ));

        // Check values.
        $this->assertEquals($exhibit->title, 'Form Title');
        $this->assertEquals($exhibit->description, 'Form description.');
        $this->assertEquals($exhibit->slug, 'form-slug');
        $this->assertEquals($exhibit->public, 1);

    }

    /**
     * The delete() method should delete the exhibit record and any
     * existing child data records.
     *
     * @return void.
     */
    public function testDelete()
    {

        // Create exhibits and items.
        $neatline1 = $this->__exhibit('test-exhibit-1');
        $neatline2 = $this->__exhibit('test-exhibit-2');
        $item1 = $this->__item();
        $item2 = $this->__item();

        // Create records.
        $record1 = new NeatlineRecord($item1, $neatline1);
        $record2 = new NeatlineRecord($item2, $neatline1);
        $record3 = new NeatlineRecord($item1, $neatline2);
        $record4 = new NeatlineRecord($item2, $neatline2);
        $record1->save();
        $record2->save();
        $record3->save();
        $record4->save();

        // 2 exhibits, 4 data records.
        $_exhibitsTable = $this->db->getTable('NeatlineExhibit');
        $_recordsTable = $this->db->getTable('NeatlineRecord');
        $this->assertEquals($_exhibitsTable->count(), 2);
        $this->assertEquals($_recordsTable->count(), 4);

        // Call delete.
        $neatline1->delete();

        // 1 exhibits, 2 data records.
        $this->assertEquals($_exhibitsTable->count(), 1);
        $this->assertEquals($_recordsTable->count(), 2);

    }

    /**
     * getNumberOfRecords() should return the exhibit record count.
     *
     * @return void.
     */
    public function testGetNumberOfRecords()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Create records.
        $record1 = new NeatlineRecord(null, $exhibit);
        $record2 = new NeatlineRecord(null, $exhibit);
        $record3 = new NeatlineRecord(null, $exhibit);
        $record1->map_active = 1;
        $record2->map_active = 1;
        $record3->map_active = 1;
        $record1->save();
        $record2->save();
        $record3->save();

        // Check count.
        $this->assertEquals($exhibit->getNumberOfRecords(), 3);

    }

}
