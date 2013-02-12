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
     * Inject mock layers JSON.
     */
    public function setUp()
    {
        parent::setUp();
        Zend_Registry::set('layers', NL_DIR . '/tests/mocks/layers.json');
    }


    /**
     * /edit/:id should display the edit form populated with values.
     */
    public function testBaseMarkup()
    {

        $exhibit = $this->__exhibit('slug');
        $exhibit->title         = 'Title';
        $exhibit->description   = 'Description.';
        $exhibit->layers        = 'Layer1,Layer3';
        $exhibit->default_layer = 'Layer3';
        $exhibit->public        = 1;
        $exhibit->save();

        $this->dispatch('neatline/edit/'.$exhibit->id);

        // Title:
        $this->assertXpath(
            '//input[@name="title"][@value="Title"]');

        // Slug:
        $this->assertXpath(
            '//input[@name="slug"][@value="slug"]');

        // Description:
        $this->assertXpathContentContains(
            '//textarea[@name="description"]',
            'Description.');

        // Layers:
        $this->assertXpath(
            '//select[@name="layers[]"]/optgroup/
            option[@selected="selected"][@value="Layer1"]');
        $this->assertXpath(
            '//select[@name="layers[]"]/optgroup/
            option[@selected="selected"][@value="Layer3"]');

        // Default Layer:
        $this->assertXpath(
            '//select[@name="default_layer"]/optgroup/
            option[@selected="selected"][@value="Layer3"]');

        // Public.
        $this->assertXpath(
            '//input[@name="public"][@checked="checked"]');

    }


    /**
     * Edit form should require a title.
     */
    public function testNoTitleError()
    {

        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'title' => ''
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="title"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Edit form should require a slug.
     */
    public function testNoSlugError()
    {

        $exhibit = $this->__exhibit();

        // Missing slug:
        $this->request->setMethod('POST')->setPost(array(
            'slug' => ''
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Edit form should block a slug with spaces.
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Edit form should block a slug with capitals.
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Edit form should block a slug with non-alphanumeric characters.
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }

    /**
     * Edit form should block a duplicate slug.
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }

    /**
     * Edit form should not block an unchanged slug.
     */
    public function testUnchangedSlug()
    {

        $exhibit = $this->__exhibit();

        // Unchanged slug.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'title',
            'slug'          => 'slug',
            'layers'        => array('Layer1', 'Layer2'),
            'default_layer' => 'Layer2'
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);

    }


    /**
     * Edit form should require at lease one base layer.
     */
    public function testNoLayersError()
    {

        $exhibit = $this->__exhibit();

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'layers' => ''
        ));

        // Submit the form.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $this->assertAction('edit');

        // Should flash error.
        $this->assertXpath('//select[@name="layers[]"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Edit form should update an exhibit when a valid title, description,
     * and slug are provided.
     */
    public function testSuccess()
    {

        $exhibit = $this->__exhibit();

        // Valid form.
        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Title 2',
            'slug'          => 'slug-2',
            'layers'        => array('Layer1', 'Layer2'),
            'default_layer' => 'Layer2',
            'description'   => 'Description 2.',
            'public'        => 0
        ));

        // Submit the form, reload exhibit.
        $this->dispatch('neatline/edit/'.$exhibit->id);
        $exhibit = $this->_exhibitsTable->find($exhibit->id);

        // Should save fields.
        $this->assertEquals($exhibit->title,          'Title 2');
        $this->assertEquals($exhibit->slug,           'slug-2');
        $this->assertEquals($exhibit->layers,         'Layer1,Layer2');
        $this->assertEquals($exhibit->default_layer,  'Layer2');
        $this->assertEquals($exhibit->description,    'Description 2.');
        $this->assertEquals($exhibit->public,         0);

    }


}
