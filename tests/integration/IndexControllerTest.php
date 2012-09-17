<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Index controller integration tests.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexControllerTest extends Neatline_Test_AppTestCase
{

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
     * When there are more exhibits than can fit on the page, show
     * pagination.
     *
     * @return void.
     */
    public function testBrowsePagination()
    {

        for ($i = 1; $i < 5; $i++) {
            $exhibit = new NeatlineExhibit();
            $exhibit->name = 'Exhibit '.$i;
            $exhibit->slug = 'slug'.$i;
            $exhibit->public = 1;
            $exhibit->is_map = 1;
            $exhibit->is_timeline = 1;
            $exhibit->is_items = 1;
            $exhibit->is_context_band = 1;
            $exhibit->save();
        }

        // Set the paging limit.
        set_option('per_page_admin', 2);

        // Hit the route.
        $this->dispatch('neatline-exhibits');

        // Check for paging.
        $neatlinesInView = __v()->neatline_exhibits;
        $this->assertEquals(count($neatlinesInView), 2);
        $this->assertQuery('div.pagination');

    }

    /**
     * Check for base markup in the add view.
     *
     * @return void.
     */
    public function testAddBaseMarkup()
    {

        // Hit the route.
        $this->dispatch('neatline-exhibits/add');

        // Check for fields.
        $this->assertQuery('input[name="title"]');
        $this->assertQuery('textarea[name="description"]');
        $this->assertQuery('input[name="slug"]');
        $this->assertQuery('input[name="public"]');

    }

    /**
     * If the title field is blank, flash error.
     *
     * @return void.
     */
    public function testAddNoTitleError()
    {

        // Missing title.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => ''
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
    public function testAddNoSlugError()
    {

        // Missing slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => ''
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
            'The slug cannot be empty.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has spaces, flash error.
     *
     * @return void.
     */
    public function testAddInvalidSlugWithSpacesError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug with spaces'
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
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has capital letters, flash error.
     *
     * @return void.
     */
    public function testAddInvalidSlugWithCapsError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'Slug-With-Capitals'
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
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug has non-alphanumerics, flash error.
     *
     * @return void.
     */
    public function testAddInvalidSlugWithNonAlphasError()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug-with-non-alphas!'
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
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug is valid, do not flash error.
     *
     * @return void.
     */
    public function testAddNoErrorForValidSlug()
    {

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'valid-slug'
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
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

    }

    /**
     * If slug is taken, flash error.
     *
     * @return void.
     */
    public function testAddDuplicateSlugError()
    {

        // Create an exhibit.
        $exhibit = $this->_createNeatline();

        // Duplicate slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'test-exhibit'
            )
        );

        // No exhibits at the start.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Submit the form.
        $this->dispatch('neatline-exhibits/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug is already in use.'
        );

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccess()
    {

        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => 'Test Exhibit',
                'description' => 'Test description.',
                'slug' => 'test-exhibit',
                'public' => 1
            )
        );

        // No exhibits at the start.
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Submit the form.
        $this->dispatch('neatline-exhibits/add');

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Get the exhibit and examine.
        $exhibit = $this->_exhibitsTable->find(1);
        $this->assertEquals($exhibit->title, 'Test Exhibit');
        $this->assertEquals($exhibit->description, 'Test description.');
        $this->assertEquals($exhibit->slug, 'test-exhibit');
        $this->assertEquals($exhibit->public, 1);
        $this->assertNull($exhibit->image_id);

    }

    /**
     * Valid form should create new exhibit.
     *
     * @return void.
     */
    public function testAddSuccessWithImage()
    {

        // TODO: This requires (really) mocking an image, at the data level.
        // But Omeka doesn't really make it possible to mock an image witout an
        // actual, no-joke image sitting in /archives (it gets checked for at
        // the level of the model).

    }

    /**
     * Test for base markup and field population in edit view.
     *
     * @return void.
     */
    public function testEditBaseMarkup()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Hit the edit form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Title.
        $this->assertXpath('//input[@name="title"][@value="Test Exhibit"]');

        // Description.
        $this->assertXpathContentContains(
            '//textarea[@name="description"]',
            'Test description.'
        );

        // Slug.
        $this->assertXpath('//input[@name="slug"][@value="test-exhibit"]');

        // Public.
        $this->assertXpath('//input[@name="public"][@checked="checked"]');

    }

    /**
     * If the title field is blank, flash error.
     *
     * @return void.
     */
    public function testEditNoTitleError()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Missing title.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => ''
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'Enter a title.'
        );

    }

    /**
     * If the slug field is blank, flash error.
     *
     * @return void.
     */
    public function testEditNoSlugError()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Missing slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => ''
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug cannot be empty.'
        );

    }

    /**
     * If slug has spaces, flash error.
     *
     * @return void.
     */
    public function testEditInvalidSlugWithSpacesError()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug with spaces'
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

    }

    /**
     * If slug has capital letters, flash error.
     *
     * @return void.
     */
    public function testEditInvalidSlugWithCapsError()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'Slug-With-Capitals'
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

    }

    /**
     * If slug has non-alphanumerics, flash error.
     *
     * @return void.
     */
    public function testEditInvalidSlugWithNonAlphasError()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug-with-non-alphas!'
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

    }

    /**
     * If slug is valid, do not flash error.
     *
     * @return void.
     */
    public function testEditNoErrorForValidSlug()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'valid-slug'
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertNotQueryContentContains(
            'ul.errors li',
            'The slug can only contain lowercase letters, numbers, and hyphens.'
        );

    }

    /**
     * If slug is taken, flash error.
     *
     * @return void.
     */
    public function testEditDuplicateSlugError()
    {

        // Create exhibits.
        $exhibit1 = $this->_createNeatline(
            $name = 'Test Exhibit 1',
            $description = 'Test description 1.',
            $slug = 'test-exhibit-1',
            $public = 1,
            $is_map = 1,
            $is_timeline = 1,
            $is_undated_items = 1
        );

        $exhibit2 = $this->_createNeatline(
            $name = 'Test Exhibit 2',
            $description = 'Test description 2.',
            $slug = 'test-exhibit-2',
            $public = 1,
            $is_map = 1,
            $is_timeline = 1,
            $is_undated_items = 1
        );

        // Duplicate slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'test-exhibit-2'
            )
        );

        // No exhibits at the start.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit1->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.errors li',
            'The slug is already in use.'
        );

    }

    /**
     * Valid form should edit exhibit.
     *
     * @return void.
     */
    public function testEditSuccess()
    {

        // Create exhibit.
        $exhibit = $this->_createNeatline();

        // Valid form.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => 'New Exhibit',
                'description' => 'New description.',
                'slug' => 'new-exhibit',
                'public' => 0
            )
        );

        // Submit the form.
        $this->dispatch('neatline-exhibits/edit/'.$exhibit->id);

        // Get the exhibit and examine.
        $exhibit = $this->_exhibitsTable->find(1);
        $this->assertEquals($exhibit->title, 'New Exhibit');
        $this->assertEquals($exhibit->description, 'New description.');
        $this->assertEquals($exhibit->slug, 'new-exhibit');
        $this->assertEquals($exhibit->public, 0);
        $this->assertNull($exhibit->image_id);

    }

    /**
     * The /openlayers route should return a well-formed JSON string for
     * the map block.
     *
     * @return void.
     */
    public function testOpenlayers()
    {

        // Create an exhibit and items.
        $neatline = $this->_createNeatline();
        $item1 = $this->_createItem();
        $item2 = $this->_createItem();

        // Create two records.
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);

        // Populate map-relevant attributes.
        $record1->title = 'Item 1 Title';
        $record2->title = 'Item 2 Title';
        $record1->slug = 'slug-1';
        $record2->slug = 'slug-2';
        $record1->vector_color = '#ffffff';
        $record2->vector_color = '#000000';
        $record1->vector_opacity = 60;
        $record2->vector_opacity = 40;
        $record1->stroke_opacity = 60;
        $record2->stroke_opacity = 40;
        $record1->graphic_opacity = 60;
        $record2->graphic_opacity = 40;
        $record1->stroke_color = '#ffffff';
        $record2->stroke_color = '#000000';
        $record1->stroke_width = 3;
        $record2->stroke_width = 2;
        $record1->point_radius = 3;
        $record2->point_radius = 2;
        $record1->geocoverage = 'POINT(1,0)';
        $record2->geocoverage = 'POINT(0,1)';
        $record1->space_active = 1;
        $record2->space_active = 1;
        $record1->map_bounds = 'CENTER(1)';
        $record2->map_bounds = 'CENTER(2)';
        $record1->map_zoom = 4;
        $record2->map_zoom = 5;
        $record1->start_visible_date = '1864-04-26 14:39:22';
        $record2->start_visible_date = '1964-04-26 14:39:22';
        $record1->end_visible_date = '1916-04-23 12:45:34';
        $record2->end_visible_date = '2016-04-23 12:45:34';
        $record1->save();
        $record2->save();

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/openlayers/' . $neatline->id);
        $response = $this->getResponse()->getBody('default');

        // Test the raw construction with no available DC values.
        $this->assertContains('"id":' . $record1->id, $response);
        $this->assertContains('"item_id":' . $item1->id, $response);
        $this->assertContains('"title":"Item 1 Title"', $response);
        $this->assertContains('"slug":"slug-1"', $response);
        $this->assertContains('"vector_color":"#ffffff"', $response);
        $this->assertContains('"vector_opacity":60', $response);
        $this->assertContains('"stroke_opacity":60', $response);
        $this->assertContains('"graphic_opacity":60', $response);
        $this->assertContains('"stroke_color":"#ffffff"', $response);
        $this->assertContains('"stroke_width":3', $response);
        $this->assertContains('"point_radius":3', $response);
        $this->assertContains('"center":"CENTER(1)"', $response);
        $this->assertContains('"zoom":4', $response);
        $this->assertContains('"wkt":"POINT(1,0)"', $response);
        $this->assertContains('"start_visible_date":"1864-04-26 14:39:22"', $response);
        $this->assertContains('"end_visible_date":"1916-04-23 12:45:34"', $response);
        $this->assertContains('"id":' . $record2->id, $response);
        $this->assertContains('"item_id":' . $item2->id, $response);
        $this->assertContains('"title":"Item 1 Title"', $response);
        $this->assertContains('"slug":"slug-2"', $response);
        $this->assertContains('"vector_color":"#000000"', $response);
        $this->assertContains('"vector_opacity":40', $response);
        $this->assertContains('"stroke_opacity":40', $response);
        $this->assertContains('"graphic_opacity":40', $response);
        $this->assertContains('"stroke_color":"#000000"', $response);
        $this->assertContains('"stroke_width":2', $response);
        $this->assertContains('"point_radius":2', $response);
        $this->assertContains('"center":"CENTER(2)"', $response);
        $this->assertContains('"zoom":5', $response);
        $this->assertContains('"wkt":"POINT(0,1)"', $response);
        $this->assertContains('"start_visible_date":"1964-04-26 14:39:22"', $response);
        $this->assertContains('"end_visible_date":"2016-04-23 12:45:34"', $response);

    }

    /**
     * The /simile route should return a well-formed JSON string for the
     * timeline block.
     *
     * @return void.
     */
    public function testSimile()
    {

        // Create an exhibit and items.
        $neatline = $this->_createNeatline();
        $item1 = $this->_createItem();
        $item2 = $this->_createItem();

        // Create two records.
        $record1 = new NeatlineDataRecord($item1, $neatline);
        $record2 = new NeatlineDataRecord($item2, $neatline);

        // Populate map-relevant attributes.
        $record1->title = 'Item 1 Title';
        $record2->title = 'Item 2 Title';
        $record1->slug = 'slug-1';
        $record2->slug = 'slug-2';
        $record1->description = 'Item 1 description.';
        $record2->description = 'Item 2 description.';
        $record1->start_date = '1564-04-26 14:39:22';
        $record2->start_date = '1564-04-26 14:39:22';
        $record1->end_date = '1616-04-23 12:45:34';
        $record2->end_date = '1616-04-23 12:45:34';
        $record1->vector_color = '#ffffff';
        $record2->vector_color = '#000000';
        $record1->left_percent = 0;
        $record2->left_percent = 0;
        $record1->right_percent = 100;
        $record1->right_percent = 100;
        $record1->time_active = 1;
        $record2->time_active = 1;
        $record1->save();
        $record2->save();

        // Hit the route and capture the response.
        $this->dispatch('neatline-exhibits/simile/' . $neatline->id);
        $response = $this->getResponse()->getBody('default');

        // Check format.
        $this->assertContains(
            '"dateTimeFormat":"iso8601"',
            $response
        );

        $this->assertContains(
            '"events":',
            $response
        );

        $this->assertContains(
            '"eventID":' . $record1->id,
            $response
        );

        $this->assertContains(
            '"title":"' . $record1->title . '"',
            $response
        );

        $this->assertContains(
            '"description":"' . $record1->description . '"',
            $response
        );

        $this->assertContains(
            '"color":"' . $record1->vector_color . '"',
            $response
        );

        $this->assertContains(
            '"left_ambiguity":' . $record1->left_percent,
            $response
        );

        $this->assertContains(
            '"right_ambiguity":' . $record1->right_percent,
            $response
        );

        $this->assertContains(
            '"start":"1564-04-26 14:39:22"',
            $response
        );

        $this->assertContains(
            '"end":"1616-04-23 12:45:34"',
            $response
        );

        $this->assertContains(
            '"dateTimeFormat":"iso8601"',
            $response
        );

        $this->assertContains(
            '"events":',
            $response
        );

        $this->assertContains(
            '"eventID":' . $record2->id,
            $response
        );

        $this->assertContains(
            '"title":"' . $record2->title . '"',
            $response
        );

        $this->assertContains(
            '"description":"' . $record2->description . '"',
            $response
        );

        $this->assertContains(
            '"color":"' . $record2->vector_color . '"',
            $response
        );

        $this->assertContains(
            '"left_ambiguity":' . $record2->left_percent,
            $response
        );

        $this->assertContains(
            '"right_ambiguity":' . $record2->right_percent,
            $response
        );

    }

    /**
     * The /udi route should return well-formed markup for the items pane.
     *
     * @return void.
     */
    public function testUdi()
    {

        // Create an exhibit and item.
        $neatline = $this->_createNeatline();

        // Create record1.
        $record1 = new NeatlineDataRecord(null, $neatline);
        $record1->title = 'Item 1 Title';
        $record1->slug = 'slug-1';
        $record1->description = 'Item 1 description.';
        $record1->items_active = 1;
        $record1->start_visible_date = '1864-04-26 14:39:22';
        $record1->end_visible_date = '1916-04-23 12:45:34';
        $record1->save();

        // Create record2.
        $record2 = new NeatlineDataRecord(null, $neatline);
        $record2->title = 'Item 2 Title';
        $record2->slug = 'slug-2';
        $record2->description = 'Item 2 description.';
        $record2->items_active = 1;
        $record2->start_visible_date = '1964-04-26 14:39:22';
        $record2->end_visible_date = '2016-04-23 12:45:34';
        $record2->save();

        // Hit the route.
        $this->dispatch('neatline-exhibits/udi/' . $neatline->id);
        $response = $this->getResponse()->getBody('default');

        // JSON -> array.
        $json = json_decode($response);

        // Check.
        $this->assertEquals(
            $json,
            array(
                (object) array(
                    'id' => $record1->id,
                    'title' => 'Item 1 Title',
                    'slug' => 'slug-1',
                    'description' => 'Item 1 description.',
                    'start_visible_date' => '1864-04-26 14:39:22',
                    'end_visible_date' => '1916-04-23 12:45:34'
                ),
                (object) array(
                    'id' => $record2->id,
                    'title' => 'Item 2 Title',
                    'slug' => 'slug-2',
                    'description' => 'Item 2 description.',
                    'start_visible_date' => '1964-04-26 14:39:22',
                    'end_visible_date' => '2016-04-23 12:45:34'
                )
            )
        );

    }

}
