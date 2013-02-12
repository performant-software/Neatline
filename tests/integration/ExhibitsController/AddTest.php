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
     * Inject mock layers JSON.
     */
    public function setUp()
    {
        parent::setUp();
        Zend_Registry::set('layers', NL_DIR . '/tests/mocks/layers.json');
    }


    /**
     * The /add route should display form elements for the exhibit title,
     * description, and slug, and a checkbox to set the exhibit public.
     */
    public function testBaseMarkup()
    {

        $this->dispatch('neatline/add');

        // Title:
        $this->assertQuery('input[name="title"]');

        // Slug:
        $this->assertQuery('input[name="slug"]');

        // Description:
        $this->assertQuery('textarea[name="description"]');

        // Layers:
        $root = '//select[@name="layers[]"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Default Layer:
        $root = '//select[@name="default_layer"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Public:
        $this->assertQuery('input[name="public"]');

    }


    /**
     * Add form should require a title.
     */
    public function testNoTitleError()
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
        $this->assertXpath('//input[@name="title"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should require a slug.
     */
    public function testNoSlugError()
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should block a slug with spaces.
     */
    public function testInvalidSlugWithSpacesError()
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should block a slug with capitals.
     */
    public function testInvalidSlugWithCapsError()
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should block a slug with non-alphanumeric characters.
     */
    public function testInvalidSlugWithNonAlphasError()
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should block a duplicate slug.
     */
    public function testDuplicateSlugError()
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
        $this->assertXpath('//input[@name="slug"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should require at least one base layer.
     */
    public function testNoLayersError()
    {

        // Missing slug.
        $this->request->setMethod('POST')->setPost(array(
            'layers' => ''
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
        $this->assertXpath('//select[@name="layers[]"]/following-sibling::
            ul[@class="error"]'
        );

    }


    /**
     * Add form should create and populate an exhibit when a valid title,
     * slug, and description are provided.
     */
    public function testSuccess()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Title',
            'slug'          => 'slug',
            'layers'        => array('Layer1', 'Layer3'),
            'default_layer' => 'Layer3',
            'description'   => 'Description.',
            'public'        => 1
        ));

        // Should create new exhibit.
        $this->assertEquals($this->_exhibitsTable->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibitsTable->count(), 1);

        // Should set exhibit fields.
        $exhibit = $this->getFirstExhibit();
        $this->assertEquals($exhibit->layers,         'Layer1,Layer3');
        $this->assertEquals($exhibit->default_layer,  'Layer3');
        $this->assertEquals($exhibit->title,          'Title');
        $this->assertEquals($exhibit->slug,           'slug');
        $this->assertEquals($exhibit->description,    'Description.');
        $this->assertEquals($exhibit->public,         1);

    }


}
