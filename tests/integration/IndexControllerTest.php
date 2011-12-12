<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Index controller integration tests.
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

class Neatline_IndexControllerTest extends Omeka_Test_AppTestCase
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
     * Index should redirect to the browse action.
     *
     * @return void.
     */
    public function testIndexRedirect()
    {

        $this->dispatch('neatline-exhibits');
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('browse');

    }

    /**
     * Check for base markup in the browse view.
     *
     * @return void.
     */
    public function testBrowseBaseMarkup()
    {

        $this->dispatch('neatline-exhibits');

        // There should be a 'Create Neatline' button.
        $this->assertQueryContentContains(
            'a.add',
            'Create a Neatline'
        );

    }

    /**
     * When there are no exhibits, the browse view should display a link
     * to create an exhibit.
     *
     * @return void.
     */
    public function testBrowseWithNoExhibits()
    {

        $this->dispatch('neatline-exhibits');

        $this->assertQueryContentContains(
            'p.neatline-alert',
            'There are no Neatline exhibits yet.'
        );

        $this->assertQueryContentContains(
            'a',
            'Create one!'
        );

    }

    /**
     * When there are exhibits, the browse view should list them.
     *
     * @return void.
     */
    public function testBrowseWithExhibits()
    {

        // Create entities.
        $exhibit = $this->helper->_createNeatline();
        $map = new NeatlineMapsMap;

        $map->name = 'Test Map';
        $map->save();

        $exhibit->map_id = $map->id;
        $exhibit->save();

        $this->dispatch('neatline-exhibits');

        // Title.
        $this->assertQueryContentContains(
            'a.neatline-title',
            'Test Exhibit'
        );

        // Map name.
        $this->assertQueryContentContains(
            'a.neatline',
            'Test Map'
        );

        // Edit.
        $this->assertQueryContentContains(
            'button', 'Edit'
        );

        // Delete.
        $this->assertQuery(
            'button', 'Delete'
        );

    }

    /**
     * When there are more exhibits than can fit on the page, show
     * pagination.
     *
     * @return void.
     */
    public function testBrowsePagination()
    {

        // Create entities.
        $exhibit1 = $this->helper->_createNeatline();
        $exhibit2 = $this->helper->_createNeatline();
        $exhibit3 = $this->helper->_createNeatline();
        $exhibit4 = $this->helper->_createNeatline();

        $map = new NeatlineMapsMap;
        $map->name = 'Test Map';
        $map->save();

        $exhibit1->map_id = $map->id;
        $exhibit1->save();
        $exhibit2->map_id = $map->id;
        $exhibit2->save();
        $exhibit3->map_id = $map->id;
        $exhibit3->save();
        $exhibit4->map_id = $map->id;
        $exhibit4->save();

        // Set the paging limit.
        set_option('per_page_admin', 2);

        $this->dispatch('neatline-exhibits');

        // Title.
        $this->assertQueryCount('table.neatline tr td.title', 2);
        $this->assertQuery('div.neatline-pagination');

    }

    /**
     * Check for base markup in the browse view.
     *
     * @return void.
     */
    public function testAddBaseMarkup()
    {

        $this->dispatch('neatline-exhibits/add');

        // There should be a title field.
        $this->assertQuery('input#title[name="title"]');

        // There should be a map select.
        $this->assertQuery('select#map[name="map"]');

    }

    /**
     * Check for error flashing.
     *
     * @return void.
     */
    public function testAddErrorFlashing()
    {

        // Missing title.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => '',
                'map' => ''
            )
        );

        // No exhibits at the start.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Submit the form.
        $this->dispatch('neatline-exhibits/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'div.neatline-error',
            'Enter a title.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccess()
    {

        // Create a map.
        $map = new NeatlineMapsMap;
        $map->name = 'Test Map';
        $map->save();

        // No exhibits at the start.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Valid form.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => 'Test Title',
                'map' => $map->id
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/add');

        // Check for the new exhibit.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

    }

    /**
     * Test delete confirm page.
     *
     * @return void.
     */
    public function testDeleteConfirm()
    {

        // Create exhibit.
        $exhibit = $this->helper->_createNeatline();

        // Hit the route.
        $this->dispatch('neatline-exhibits/delete/' . $exhibit->id);
        $this->assertResponseCode(200);

        // Check the form and action.
        $action = neatline_getDeleteExhibitUrl($exhibit->id);
        $this->assertQuery('form#delete-neatline[action="' . $action . '"]');

    }

    /**
     * Test delete.
     *
     * @return void.
     */
    public function testDeleteSuccess()
    {

        // Create exhibits.
        $exhibit1 = $this->helper->_createNeatline();
        $exhibit2 = $this->helper->_createNeatline();

        // 2 exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 2);

        // Confirm delete.
        $this->request->setMethod('POST')
            ->setPost(array(
                'confirmed' => 'confirmed'
            )
        );

        // Hit the route.
        $this->dispatch('neatline-exhibits/delete/' . $exhibit1->id);

        // 1 exhibit, check identity.
        $this->assertEquals($this->_exhibitsTable->count(), 1);
        $this->assertNotNull($this->_exhibitsTable->find($exhibit2->id));

    }

}
