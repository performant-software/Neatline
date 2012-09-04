<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Exhibit record table tests.
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

class Neatline_NeatlineExhibitTableTest extends Neatline_Test_AppTestCase
{

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();

        $this->db = get_db();
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');

    }

    /**
     * findBySlug() should return the exhibit with the passed slug.
     *
     * @return void.
     */
    public function testFindBySlug()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline(
            $name = 'Test Exhibit',
            $description = 'Test description.',
            $slug = 'test-slug',
            $public = 1,
            $is_map = 1,
            $is_timeline = 1,
            $is_undated_items = 1,
            $is_context_band = 1
        );

        // Get the exhibit, check.
        $retrievedExhibit = $this->_exhibitsTable->findBySlug('test-slug');
        $this->assertEquals($retrievedExhibit->id, $exhibit->id);

    }

    /**
     * This checks that findBySlug appropriately escapes all input before
     * passing it to SQL.
     *
     * @return void
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function testFindBySlugHole()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline(
            $name = 'Test Exhibit',
            $description = 'Test description.',
            $slug = '---select-1-',
            $public = 1,
            $is_map = 1,
            $is_timeline = 1,
            $is_undated_items = 1,
            $is_context_band = 1
        );

        // Get the exhibit, check.
        $retrievedExhibit = $this->_exhibitsTable->findBySlug('"; syntax error 1;');
        $this->assertNull($retrievedExhibit);

    }

}
