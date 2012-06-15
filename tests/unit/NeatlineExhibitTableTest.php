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
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_NeatlineExhibitTableTest extends Omeka_Test_AppTestCase
{

    /**
     * Instantiate the helper class, install the plugins, get the database.
     *
     * @return void.
     */
    public function setUp()
    {

        parent::setUp();
        $this->helper = new Neatline_Test_AppTestCase;
        $this->helper->setUpPlugin();
        $this->db = get_db();
        $this->_exhibitsTable = $this->db->getTable('NeatlineExhibit');

    }

    /**
     * getNeatlinesForBrowser() should return a well-formed array of Neatline exhbits
     * for the main administrative browse view.
     *
     * @return void.
     */
    public function testGetNeatlinesForBrowser()
    {

        for ($i = 1; $i < 5; $i++) {
            $exhibit = new NeatlineExhibit();
            $exhibit->name = 'Exhibit '.$i;
            $exhibit->public = 1;
            $exhibit->is_map = 1;
            $exhibit->is_timeline = 1;
            $exhibit->is_items = 1;
            $exhibit->is_context_band = 1;
            $exhibit->save();
        }

        // By default, order by date descending.
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('added', 'd', 1);
        $this->assertEquals(count($exhibits), 4);

        // Paging (1).
        set_option('per_page_admin', 2);
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'a', 1);
        $this->assertEquals(count($exhibits), 2);

        // Paging (2).
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'a', 2);
        $this->assertEquals(count($exhibits), 2);
    }

    /**
     * getPaginationSettings() should return a well-formed configuration array for
     * the pagination view helpers.
     *
     * @return void.
     */
    public function testGetPaginationSettings()
    {

        for ($i = 1; $i < 5; $i++) {
            $exhibit = new NeatlineExhibit();
            $exhibit->name = 'Exhibit '.$i;
            $exhibit->public = 1;
            $exhibit->is_map = 1;
            $exhibit->is_timeline = 1;
            $exhibit->is_items = 1;
            $exhibit->is_context_band = 1;
            $exhibit->save();
        }

        // Check.
        set_option('per_page_admin', 2);
        $this->assertEquals(
            $this->_exhibitsTable->getPaginationSettings(1),
            array(
                'current_page' => 1,
                'per_page' => 2,
                'total_results' => 4
            )
        );

    }

    /**
     * findBySlug() should return the exhibit with the passed slug.
     *
     * @return void.
     */
    public function testFindBySlug()
    {

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline(
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

}
