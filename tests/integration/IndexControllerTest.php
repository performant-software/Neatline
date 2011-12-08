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
        $this->assertQueryContains(
            'a[href="' . __v()->uriSlug . '/editor/' . $exhibit->id . '"]'
        );

        // Delete.
        $this->assertQueryContains(
            'a[href="' . __v()->uriSlug . '/delete/' . $exhibit->id . '"]'
        );

    }

}
