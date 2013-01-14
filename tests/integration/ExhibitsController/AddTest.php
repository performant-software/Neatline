<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for add action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsControllerTest_Add
    extends Neatline_Test_AppTestCase
{


    /**
     * The /add route should display form elements for the exhibit title,
     * description, and slug, and a checkbox to set the exhibit public.
     */
    public function testAddBaseMarkup()
    {
        $this->dispatch('neatline/add');
        $this->assertQuery('input[name="title"]');
        $this->assertQuery('textarea[name="description"]');
        $this->assertQuery('input[name="slug"]');
        $this->assertQuery('input[name="public"]');
    }


    /**
     * Add form should require a title.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'Enter a title.'
        );

    }


    /**
     * Add form should require a slug.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug cannot be empty.'
        );

    }


    /**
     * Add form should block a slug with spaces.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * Add form should block a slug with capitals.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * Add form should block a slug with non-alphanumeric characters.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * Add form should block a duplicate slug.
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
        $this->assertController('exhibits');
        $this->assertAction('add');

        // Should flash error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug is already in use.'
        );

    }


    /**
     * Add form should create and populate an exhibit when a valid title,
     * description, and slug are provided.
     */
    public function testAddSuccess()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Test Exhibit',
            'description'   => 'Test description.',
            'slug'          => 'test-exhibit',
            'public'        => 1
        ));

        // Should create new exhibit.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Should set exhibit fields.
        $exhibit = $this->getFirstExhibit();
        $this->assertEquals($exhibit->title, 'Test Exhibit');
        $this->assertEquals($exhibit->description, 'Test description.');
        $this->assertEquals($exhibit->slug, 'test-exhibit');
        $this->assertEquals($exhibit->public, 1);

    }


}
