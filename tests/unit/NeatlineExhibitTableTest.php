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
?>

<?php

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

        $exhibit1 = new NeatlineExhibit();
        $exhibit1->name = 'B';
        $exhibit1->is_map = 1;
        $exhibit1->is_timeline = 1;
        $exhibit1->is_undated_items = 1;
        $exhibit1->added = '2011-12-05 09:16:00';
        $exhibit1->save();

        $exhibit2 = new NeatlineExhibit();
        $exhibit2->name = 'A';
        $exhibit2->is_map = 1;
        $exhibit2->is_timeline = 1;
        $exhibit2->is_undated_items = 1;
        $exhibit2->added = '2011-12-05 09:16:01';
        $exhibit2->save();

        $exhibit3 = new NeatlineExhibit();
        $exhibit3->name = 'D';
        $exhibit3->is_map = 1;
        $exhibit3->is_timeline = 1;
        $exhibit3->is_undated_items = 1;
        $exhibit3->added = '2011-12-05 09:16:02';
        $exhibit3->save();

        $exhibit4 = new NeatlineExhibit();
        $exhibit4->name = 'C';
        $exhibit4->is_map = 1;
        $exhibit4->is_timeline = 1;
        $exhibit4->is_undated_items = 1;
        $exhibit4->added = '2011-12-05 09:16:03';
        $exhibit4->save();

        // By default, order by date descending.
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('added', 'd', 1);
        $this->assertEquals(count($exhibits), 4);
        $this->assertEquals($exhibits[0]->id, $exhibit4->id);
        $this->assertEquals($exhibits[1]->id, $exhibit3->id);
        $this->assertEquals($exhibits[2]->id, $exhibit2->id);
        $this->assertEquals($exhibits[3]->id, $exhibit1->id);

        // Date ascending.
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('added', 'a', 1);
        $this->assertEquals(count($exhibits), 4);
        $this->assertEquals($exhibits[0]->id, $exhibit1->id);
        $this->assertEquals($exhibits[1]->id, $exhibit2->id);
        $this->assertEquals($exhibits[2]->id, $exhibit3->id);
        $this->assertEquals($exhibits[3]->id, $exhibit4->id);

        // Title descending.
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'd', 1);
        $this->assertEquals(count($exhibits), 4);
        $this->assertEquals($exhibits[0]->id, $exhibit3->id);
        $this->assertEquals($exhibits[1]->id, $exhibit4->id);
        $this->assertEquals($exhibits[2]->id, $exhibit1->id);
        $this->assertEquals($exhibits[3]->id, $exhibit2->id);

        // Title descending.
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'a', 1);
        $this->assertEquals(count($exhibits), 4);
        $this->assertEquals($exhibits[0]->id, $exhibit2->id);
        $this->assertEquals($exhibits[1]->id, $exhibit1->id);
        $this->assertEquals($exhibits[2]->id, $exhibit4->id);
        $this->assertEquals($exhibits[3]->id, $exhibit3->id);

        // Paging (1).
        set_option('per_page_admin', 2);
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'a', 1);
        $this->assertEquals(count($exhibits), 2);
        $this->assertEquals($exhibits[0]->id, $exhibit2->id);
        $this->assertEquals($exhibits[1]->id, $exhibit1->id);

        // Paging (2).
        $exhibits = $this->_exhibitsTable->getNeatlinesForBrowse('name', 'a', 2);
        $this->assertEquals(count($exhibits), 2);
        $this->assertEquals($exhibits[0]->id, $exhibit4->id);
        $this->assertEquals($exhibits[1]->id, $exhibit3->id);

    }

}
