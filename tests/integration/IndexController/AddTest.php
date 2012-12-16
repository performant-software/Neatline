<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for add action in index controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexControllerTest_Add
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * The /add route should display form elements for the exhibit title,
     * description, and slug, and a checkbox to set the exhibit public.
     * --------------------------------------------------------------------
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
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with an empty title,
     * the form should be redisplayed with an error and an exhibit should
     * not be created.
     * --------------------------------------------------------------------
     */
    public function testAddNoTitleError()
    {

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'title' => ''
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'Enter a title.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with an empty slug,
     * the form should be redisplayed with an error and an exhibit should
     * not be created.
     * --------------------------------------------------------------------
     */
    public function testAddNoSlugError()
    {

        // Missing slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => ''
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug cannot be empty.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with a slug that has
     * spaces, the form should be redisplayed with an error and an exhibit
     * should not be created.
     * --------------------------------------------------------------------
     */
    public function testAddInvalidSlugWithSpacesError()
    {

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug with spaces'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with a slug that has
     * capital letters, the form should be redisplayed with an error and
     * an exhibit should not be created.
     * --------------------------------------------------------------------
     */
    public function testAddInvalidSlugWithCapsError()
    {

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with a slug that has
     * non-alphanumeric characters, the form should be redisplayed with an
     * error and an exhibit should not be created.
     * --------------------------------------------------------------------
     */
    public function testAddInvalidSlugWithNonAlphasError()
    {

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug-with-non-alphas!'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 0);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with a slug that is
     * the same as the slug of an existing exhibit, the form should be
     * redisplayed and an exhibit should not be created.
     * --------------------------------------------------------------------
     */
    public function testAddDuplicateSlugError()
    {

        // Create an exhibit.
        $exhibit = $this->__exhibit('test-exhibit');

        // Duplicate slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'test-exhibit'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibitsTable->count(), 1);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Should redisplay the form.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('add');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug is already in use.'
        );

    }


    /**
     * --------------------------------------------------------------------
     * When the "Create an Exhibit" form is submitted with a title and a
     * valid slug, a new exhibit should be created and populated with the
     * values for the title, slug, dsecription, and public status.
     * --------------------------------------------------------------------
     */
    public function testAddSuccess()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Test Exhibit',
            'description'   => 'Test description.',
            'slug'          => 'test-exhibit',
            'public'        => 1
        ));

        // Submit the form, check for new exhibit.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Get the exhibit and examine.
        $exhibit = $this->getFirstExhibit();
        $this->assertEquals($exhibit->title, 'Test Exhibit');
        $this->assertEquals($exhibit->description, 'Test description.');
        $this->assertEquals($exhibit->slug, 'test-exhibit');
        $this->assertEquals($exhibit->public, 1);

    }


}
