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
     * --------------------------------------------------------------------
     * The /edit/:id route should display the exhibit edit form populated
     * with exhibit values.
     * --------------------------------------------------------------------
     */
    public function testEditBaseMarkup()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Fields:
        $exhibit->title         = 'title';
        $exhibit->description   = 'description';
        $exhibit->public        = 1;
        $exhibit->save();

        // Hit /edit.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Title:
        $this->assertXpath(
            '//input[@name="title"][@value="title"]'
        );

        // Description:
        $this->assertXpathContentContains(
            '//textarea[@name="description"]',
            'description'
        );

        // Slug:
        $this->assertXpath(
            '//input[@name="slug"][@value="slug"]'
        );

        // Public.
        $this->assertXpath(
            '//input[@name="public"][@checked="checked"]'
        );

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should require a title.
     * --------------------------------------------------------------------
     */
    public function testEditNoTitleError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();
        $exhibit->title = "title";
        $exhibit->save();

        // Missing title:
        $this->request->setMethod('POST')->setPost(array(
            'title' => ''
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'Enter a title.'
        );

        // Check for unsaved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->title, 'title');

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should require a slug.
     * --------------------------------------------------------------------
     */
    public function testEditNoSlugError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Missing slug:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => ''
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug cannot be empty.'
        );

        // Check for unsaved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->slug, 'slug');

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should block a slug with spaces.
     * --------------------------------------------------------------------
     */
    public function testEditInvalidSlugWithSpacesError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Spaces:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug with spaces'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

        // Check for unsaved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->slug, 'slug');

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should block a slug with capitals.
     * --------------------------------------------------------------------
     */
    public function testEditInvalidSlugWithCapsError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Capitals:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

        // Check for unsaved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->slug, 'slug');

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should block a slug with non-alphanumeric characters.
     * --------------------------------------------------------------------
     */
    public function testEditInvalidSlugWithNonAlphasError()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Non-alphanumerics:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug#with%non&alphas!'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug can only contain letters, numbers, and hyphens.'
        );

        // Check for unsaved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->slug, 'slug');

    }

    /**
     * --------------------------------------------------------------------
     * Edit form should block a duplicate slug.
     * --------------------------------------------------------------------
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

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit1->id);
        $this->assertAction('edit');

        // Check for the error.
        $this->assertQueryContentContains(
            'ul.error li',
            'The slug is already in use.'
        );

    }

    /**
     * --------------------------------------------------------------------
     * Edit form should not block an unchanged slug.
     * --------------------------------------------------------------------
     */
    public function testEditUnchangedSlug()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit('slug');

        // Unchanged slug.
        $this->request->setMethod('POST')->setPost(array(
            'title' => 'title',
            'slug' => 'slug'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Check for saved exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->title, 'title');

    }


    /**
     * --------------------------------------------------------------------
     * Edit form should update an exhibit when a valid title, description,
     * and slug are provided.
     * --------------------------------------------------------------------
     */
    public function testEditSuccess()
    {

        // Create exhibit.
        $exhibit = $this->__exhibit();

        // Valid form.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'title2',
            'description'   => 'desc2',
            'slug'          => 'slug2',
            'public'        => 1
        ));

        // Submit the form, reload exhibit.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Check fields.
        $this->assertEquals($exhibit->title,        'title2');
        $this->assertEquals($exhibit->description,  'desc2');
        $this->assertEquals($exhibit->slug,         'slug2');
        $this->assertEquals($exhibit->public,       1);

    }


}
