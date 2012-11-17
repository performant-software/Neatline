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

        $this->dispatch('neatline');
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
        $this->dispatch('neatline');
        $this->assertQueryContentContains('a.add', 'Create an Exhibit');
    }

    /**
     * When there are no exhibits, the browse view should display a link
     * to create an exhibit.
     *
     * @return void.
     */
    public function testBrowseWithNoExhibits()
    {

        $this->dispatch('neatline');

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
     * Show pagination when exhibits can't fit on a single page.
     *
     * @return void.
     */
    public function testBrowsePagination()
    {

        // Create 5 exhibits.
        for ($i = 0; $i < 5; $i++) $this->__exhibit('slug'.$i);

        // Set the paging limit.
        set_option('per_page_admin', 2);

        // Hit the route.
        $this->dispatch('neatline');

        // Check for paging.
        $neatlinesInView = get_view()->neatline_exhibits;
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
        $this->dispatch('neatline/add');

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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertNotQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit('test-exhibit');

        // Duplicate slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'test-exhibit'
            )
        );

        // No exhibits at the start.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Submit the form.
        $this->dispatch('neatline/add');

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $this->dispatch('neatline/add');

        // No exhibit should have been created.
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Get the exhibit and examine.
        $exhibit = $this->getFirstExhibit();
        $this->assertEquals($exhibit->title, 'Test Exhibit');
        $this->assertEquals($exhibit->description, 'Test description.');
        $this->assertEquals($exhibit->slug, 'test-exhibit');
        $this->assertEquals($exhibit->public, 1);

    }

    /**
     * Test for base markup and field population in edit view.
     *
     * @return void.
     */
    public function testEditBaseMarkup()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('test-exhibit');
        $exhibit->title = 'Test Exhibit';
        $exhibit->description = 'Test description.';
        $exhibit->public = 1;
        $exhibit->save();

        // Hit the edit form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Title.
        $this->assertXpath('//input[@name="title"][@value="Test Exhibit"]');

        // Description.
        $this->assertXpathContentContains('//textarea[@name="description"]',
            'Test description.');

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
        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')
            ->setPost(array(
                'title' => ''
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

        // Missing slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => ''
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug with spaces'
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'Slug-With-Capitals'
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'slug-with-non-alphas!'
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'valid-slug'
            )
        );

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertNotQueryContentContains(
            'ul.error li',
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
        $exhibit1 = $this->__exhibit('test-exhibit-1');
        $exhibit2 = $this->__exhibit('test-exhibit-2');

        // Duplicate slug.
        $this->request->setMethod('POST')
            ->setPost(array(
                'slug' => 'test-exhibit-2'
            )
        );

        // No exhibits at the start.
        $this->dispatch('neatline/edit/'.$exhibit1->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
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
        $exhibit = $this->__exhibit();

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
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Get the exhibit and examine.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->title, 'New Exhibit');
        $this->assertEquals($exhibit->description, 'New description.');
        $this->assertEquals($exhibit->slug, 'new-exhibit');
        $this->assertEquals($exhibit->public, 0);
        $this->assertNull($exhibit->image_id);

    }

    /**
     * /records should emit a JSON object containing all record data
     * needed by the front-end application.
     *
     * @return void.
     */
    public function testRecords()
    {

        // Create exhibit and record.
        $exhibit = $this->__exhibit();
        $record1 = $this->__record(null, $exhibit);
        $record2 = $this->__record(null, $exhibit);

        // Hit data route.
        $this->dispatch('neatline/records/'.$exhibit->id);
        $response = json_decode($this->getResponse()->getBody('default'));

        // Check code and length.
        $this->assertResponseCode(200);
        $this->assertEquals(count($response), 2);

        // Check for keys.
        $this->assertObjectHasAttribute('id',                 $response[0]);
        $this->assertObjectHasAttribute('item_id',            $response[0]);
        $this->assertObjectHasAttribute('title',              $response[0]);
        $this->assertObjectHasAttribute('description',        $response[0]);
        $this->assertObjectHasAttribute('slug',               $response[0]);
        $this->assertObjectHasAttribute('vector_color',       $response[0]);
        $this->assertObjectHasAttribute('stroke_color',       $response[0]);
        $this->assertObjectHasAttribute('select_color',       $response[0]);
        $this->assertObjectHasAttribute('vector_opacity',     $response[0]);
        $this->assertObjectHasAttribute('select_opacity',     $response[0]);
        $this->assertObjectHasAttribute('stroke_opacity',     $response[0]);
        $this->assertObjectHasAttribute('graphic_opacity',    $response[0]);
        $this->assertObjectHasAttribute('stroke_width',       $response[0]);
        $this->assertObjectHasAttribute('point_radius',       $response[0]);
        $this->assertObjectHasAttribute('point_image',        $response[0]);
        $this->assertObjectHasAttribute('map_focus',          $response[0]);
        $this->assertObjectHasAttribute('coverage',           $response[0]);
        $this->assertObjectHasAttribute('wmsAddress',         $response[0]);
        $this->assertObjectHasAttribute('layers',             $response[0]);

    }

    /**
     * /record should update a record on PUT.
     *
     * @return void.
     */
    public function testRecordPUT()
    {

        // Create record.
        $exhibit = $this->__exhibit();
        $record = $this->__record();

        // Set parameters.
        $record->title              = 'title';
        $record->description        = 'desc';
        $record->slug               = 'slug';
        $record->vector_color       = '#vector';
        $record->stroke_color       = '#stroke';
        $record->select_color       = '#select';
        $record->vector_opacity     = 1;
        $record->select_opacity     = 2;
        $record->stroke_opacity     = 3;
        $record->graphic_opacity    = 4;
        $record->stroke_width       = 5;
        $record->point_radius       = 6;
        $record->point_image        = 'file.png';
        $record->map_focus          = 'lat/lon';
        $record->map_zoom           = 7;
        $record->coverage           = 'kml';
        $record->map_active         = 1;
        $record->save();

        // Mock values.
        $values = array(
            'id'                    => $record->id,
            'item_id'               => null,
            'title'                 => 'title2',
            'description'           => 'desc2',
            'slug'                  => 'slug2',
            'vector_color'          => '#vector2',
            'stroke_color'          => '#stroke2',
            'select_color'          => '#select2',
            'vector_opacity'        => '10',
            'select_opacity'        => '20',
            'stroke_opacity'        => '30',
            'graphic_opacity'       => '40',
            'stroke_width'          => '50',
            'point_radius'          => '60',
            'point_image'           => 'file2.png',
            'map_focus'             => 'lat2/lon2',
            'map_zoom'              => '70',
            'coverage'              => 'kml2',
            'bounds'                => 'POLYGON((0 0,0 1,1 1,1 0))',
            'map_active'            => '0'
        );

        // Mock PUT.
        $this->writePut($values);

        // Issue request.
        $this->request->setMethod('PUT');
        $this->dispatch('neatline/record');

        // Re-get record.
        $record = $this->_recordsTable->find($record->id);

        // Check new values.
        $this->assertEquals($record->title, 'title2');
        $this->assertEquals($record->description, 'desc2');
        $this->assertEquals($record->slug, 'slug2');
        $this->assertEquals($record->vector_color, '#vector2');
        $this->assertEquals($record->stroke_color, '#stroke2');
        $this->assertEquals($record->select_color, '#select2');
        $this->assertEquals($record->vector_opacity, 10);
        $this->assertEquals($record->select_opacity, 20);
        $this->assertEquals($record->stroke_opacity, 30);
        $this->assertEquals($record->graphic_opacity, 40);
        $this->assertEquals($record->stroke_width, 50);
        $this->assertEquals($record->point_radius, 60);
        $this->assertEquals($record->point_image, 'file2.png');
        $this->assertEquals($record->map_focus, 'lat2/lon2');
        $this->assertEquals($record->map_zoom, 70);
        $this->assertEquals($record->coverage, 'kml2');
        $this->assertEquals($record->map_active, 0);

    }

}
