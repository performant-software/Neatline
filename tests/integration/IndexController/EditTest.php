<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for edit action in index controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexControllerTest_Edit
    extends Neatline_Test_AppTestCase
{


    /**
     * Test for base markup and field population in edit view.
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
        $this->assertXpath(
            '//input[@name="title"][@value="Test Exhibit"]'
        );

        // Description.
        $this->assertXpathContentContains(
            '//textarea[@name="description"]',
            'Test description.'
        );

        // Slug.
        $this->assertXpath(
            '//input[@name="slug"][@value="test-exhibit"]'
        );

        // Public.
        $this->assertXpath(
            '//input[@name="public"][@checked="checked"]'
        );

    }


    /**
     * If the title field is blank, flash error.
     */
    public function testEditNoTitleError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'title' => ''
        ));

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
     */
    public function testEditNoSlugError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Missing slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => ''
        ));

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
     */
    public function testEditInvalidSlugWithSpacesError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug with spaces'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * If slug has capital letters, flash error.
     */
    public function testEditInvalidSlugWithCapsError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * If slug has non-alphanumerics, flash error.
     */
    public function testEditInvalidSlugWithNonAlphasError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug-with-non-alphas!'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }


    /**
     * If slug is valid, do not flash error.
     */
    public function testEditNoErrorForValidSlug()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'valid-slug'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should redirect to the add view.
        $this->assertModule('neatline');
        $this->assertController('index');
        $this->assertAction('edit');

        // Check for the error.
        $this->assertNotQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

    }

    /**
     * If slug is taken, flash error.
     */
    public function testEditDuplicateSlugError()
    {

        // Create exhibits.
        $exhibit1 = $this->__exhibit('test-exhibit-1');
        $exhibit2 = $this->__exhibit('test-exhibit-2');

        // Duplicate slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'test-exhibit-2'
        ));

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
     */
    public function testEditSuccess()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Valid form.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'New Exhibit',
            'description'   => 'New description.',
            'slug'          => 'new-exhibit',
            'public'        => 0
        ));

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


}
