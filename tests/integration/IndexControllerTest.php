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
        $this->_layersTable = $this->db->getTable('NeatlineBaseLayer');

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
            'Create an Exhibit'
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
        $exhibit1->save();
        $exhibit2->save();
        $exhibit3->save();
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

        /*
         * Mock base layers.
         */

        // Get all existing base layer records.
        $layers = $this->_layersTable->fetchObjects(
            $this->_layersTable->getSelect()
        );

        // Delete.
        foreach($layers as $layer) {
            $layer->delete();
        }

        // OpenStreetMaps.
        $osm = new NeatlineBaseLayer;
        $osm->name = 'OpenStreetMap';
        $osm->save();

        // Google physical.
        $gphy = new NeatlineBaseLayer;
        $gphy->name = 'Google Physical';
        $gphy->save();

        // Google streets.
        $gstr = new NeatlineBaseLayer;
        $gstr->name = 'Google Streets';
        $gstr->save();

        // Google hybrid.
        $ghyb = new NeatlineBaseLayer;
        $ghyb->name = 'Google Hybrid';
        $ghyb->save();

        // Google sattelite.
        $gsat = new NeatlineBaseLayer;
        $gsat->name = 'Google Satellite';
        $gsat->save();

        /*
         * Mock maps.
         */

        $map1 = new NeatlineMapsMap;
        $map1->name = 'Map1';
        $map1->save();
        $map2 = new NeatlineMapsMap;
        $map2->name = 'Map2';
        $map2->save();
        $map3 = new NeatlineMapsMap;
        $map3->name = 'Map3';
        $map3->save();

        // Hit the route.
        $this->dispatch('neatline-exhibits/add');

        // Check for fields.
        $this->assertQuery('input[name="title"]');
        $this->assertQuery('input[name="slug"]');
        $this->assertQuery('input[name="public"]');
        $this->assertQuery('select[name="baselayer"]');
        $this->assertQuery('select[name="map"]');
        $this->assertQuery('select[name="image"]');

        // Check for base layer options.
        $this->assertQueryContentContains(
            'select[name="baselayer"] option[value="' . $osm->id . '"]',
            'OpenStreetMap');
        $this->assertQueryContentContains(
            'select[name="baselayer"] option[value="' . $gphy->id . '"]',
            'Google Physical');
        $this->assertQueryContentContains(
            'select[name="baselayer"] option[value="' . $gstr->id . '"]',
            'Google Streets');
        $this->assertQueryContentContains(
            'select[name="baselayer"] option[value="' . $ghyb->id . '"]',
            'Google Hybrid');
        $this->assertQueryContentContains(
            'select[name="baselayer"] option[value="' . $gsat->id . '"]',
            'Google Satellite');

        // Check for maps.
        $this->assertQueryContentContains(
            'select[name="map"] option[value="none"]',
            '-');
        $this->assertQueryContentContains(
            'select[name="map"] option[value="' . $map1->id . '"]',
            'Map1');
        $this->assertQueryContentContains(
            'select[name="map"] option[value="' . $map2->id . '"]',
            'Map2');
        $this->assertQueryContentContains(
            'select[name="map"] option[value="' . $map3->id . '"]',
            'Map3');

        // TODO: Test the images dropdown. This is complicated by the fact
        // that the Omeka files table checks for a real file in the archives
        // folder, so mocking files is difficult.

    }

    /**
     * If the title field is blank, flash error.
     *
     * @return void.
     */
    public function testNoTitleError()
    {

        // Missing title.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => '',
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
            'ul.errors li',
            'Enter a title.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If the slug field is blank, flash error.
     *
     * @return void.
     */
    public function testNoSlugError()
    {

        // Missing slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => '',
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
            'ul.errors li',
            'Enter a slug.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has spaces, flash error.
     *
     * @return void.
     */
    public function testInvalidSlugWithSpacesError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug with spaces',
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
            'ul.errors li',
            'Lowercase letters, numbers, and hyphens only.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has capital letters, flash error.
     *
     * @return void.
     */
    public function testInvalidSlugWithCapsError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'Slug-With-Capitals',
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
            'ul.errors li',
            'Lowercase letters, numbers, and hyphens only.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has non-alphanumerics, flash error.
     *
     * @return void.
     */
    public function testInvalidSlugWithNonAlphasError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug-with-non-alphas!',
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
            'ul.errors li',
            'Lowercase letters, numbers, and hyphens only.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug is valid, do not flash error.
     *
     * @return void.
     */
    public function testNoErrorForValidSlug()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'valid-slug',
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
        $this->assertNotQueryContentContains(
            'ul.errors li',
            'Lowercase letters, numbers, and hyphens only.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug is taken, flash error.
     *
     * @return void.
     */
    public function testDuplicateSlugError()
    {

    }

    /**
     * If a map and an image is selected, flash error.
     *
     * @return void.
     */
    public function testBothMapAndImageError()
    {

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccessWithNoMapAndNoImage()
    {

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccessWithMap()
    {

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccessWithImage()
    {

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
