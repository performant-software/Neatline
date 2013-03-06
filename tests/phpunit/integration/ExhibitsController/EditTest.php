<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for edit action in exhibits controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsControllerTest_Edit
    extends Neatline_Test_AppTestCase
{


    /**
     * The /edit/:id route should display the edit form.
     */
    public function testBaseMarkup()
    {

        $exhibit = $this->__exhibit('slug');
        $exhibit->title         = 'Title';
        $exhibit->description   = 'Description.';
        $exhibit->base_layers   = 'Layer1,Layer3';
        $exhibit->base_layer    = 'Layer3';
        $exhibit->widgets       = 'Widget1,Widget2';
        $exhibit->public        = 1;
        $exhibit->save();

        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Title:
        $this->assertXpath(
            '//input[@name="title"][@value="Title"]');

        // Slug:
        $this->assertXpath(
            '//input[@name="slug"][@value="slug"]');

        // Base Layers:
        $this->assertXpath(
            '//select[@name="base_layers[]"]/optgroup/
            option[@selected="selected"][@value="Layer1"]');
        $this->assertXpath(
            '//select[@name="base_layers[]"]/optgroup/
            option[@selected="selected"][@value="Layer3"]');

        // Default Base Layer:
        $this->assertXpath(
            '//select[@name="base_layer"]/optgroup/
            option[@selected="selected"][@value="Layer3"]');

        // Widgets:
        $this->assertXpath(
            '//select[@name="widgets[]"]/
            option[@selected="selected"][@value="Widget1"]');
        $this->assertXpath(
            '//select[@name="widgets[]"]/
            option[@selected="selected"][@value="Widget2"]');

        // Description:
        $this->assertXpathContentContains(
            '//textarea[@name="description"]',
            'Description.');

        // Public.
        $this->assertXpath(
            '//input[@name="public"][@checked="checked"]');

    }


    /**
     * A title is required.
     */
    public function testNoTitleError()
    {

        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'title'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="title"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * A slug is required.
     */
    public function testNoSlugError()
    {

        $exhibit = $this->__exhibit();

        // Missing slug:
        $this->request->setMethod('POST')->setPost(array(
            'slug'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * The slug cannot have spaces.
     */
    public function testInvalidSlugWithSpacesError()
    {

        $exhibit = $this->__exhibit();

        // Spaces:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug with spaces'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * The slug cannot have capitals.
     */
    public function testInvalidSlugWithCapsError()
    {

        $exhibit = $this->__exhibit();

        // Capitals:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * The slug cannot have non-alphanumeric characters.
     */
    public function testInvalidSlugWithNonAlphasError()
    {

        $exhibit = $this->__exhibit();

        // Non-alphanumerics:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug#with%non&alphas!'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }

    /**
     * The slug cannot be the same as the slug for another exhibit.
     */
    public function testDuplicateSlugError()
    {

        $exhibit1 = $this->__exhibit('slug-1');
        $exhibit2 = $this->__exhibit('slug-2');

        // Duplicate slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug-2'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit1->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }

    /**
     * The new slug can be the same as the current slug.
     */
    public function testUnchangedSlug()
    {

        $exhibit = $this->__exhibit();

        // Unchanged slug.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'title',
            'slug'          => 'slug',
            'base_layers'   => array('Layer1', 'Layer2'),
            'base_layer'    => 'Layer2',
            'widgets'       => array('Widget1', 'Widget2'),
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Should save exhibit.
        $exhibit = $this->_exhibitsTable->find($exhibit->id);
        $this->assertEquals($exhibit->title, 'title');

    }


    /**
     * A default base layer must be selected.
     */
    public function testNoDefaultLayersError()
    {

        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'base_layer'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//select[@name="base_layer"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * When all fields are valid, the exhibit should be updated.
     */
    public function testSuccess()
    {

        $exhibit = $this->__exhibit();

        // Valid form.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Title 2',
            'slug'          => 'slug-2',
            'base_layers'   => array('Layer1', 'Layer2'),
            'base_layer'    => 'Layer2',
            'widgets'       => array('Widget1', 'Widget2'),
            'description'   => 'Description 2.',
            'public'        => 0
        ));

        // Submit the form, reload exhibit.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Should set fields.
        $this->assertEquals($exhibit->title,        'Title 2');
        $this->assertEquals($exhibit->slug,         'slug-2');
        $this->assertEquals($exhibit->base_layers,  'Layer1,Layer2');
        $this->assertEquals($exhibit->base_layer,   'Layer2');
        $this->assertEquals($exhibit->widgets,      'Widget1,Widget2');
        $this->assertEquals($exhibit->description,  'Description 2.');
        $this->assertEquals($exhibit->public,       0);

    }


}
