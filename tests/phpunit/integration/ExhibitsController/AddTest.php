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
     * The /add route should display the add exhibit form.
     */
    public function testBaseMarkup()
    {

        $this->dispatch('neatline/add');

        // Title:
        $this->assertXpath('//input[@name="title"]');

        // Slug:
        $this->assertXpath('//input[@name="slug"]');

        // Base Layers:
        $root = '//select[@name="base_layers[]"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Default Base Layer:
        $root = '//select[@name="base_layer"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Widgets:
        $root = '//select[@name="widgets[]"]';
        $this->assertXpath($root.'/option[@value="Widget1"]');
        $this->assertXpath($root.'/option[@value="Widget2"]');
        $this->assertXpath($root.'/option[@value="Widget3"]');

        // Description:
        $this->assertXpath('//textarea[@name="description"]');

        // Public:
        $this->assertXpath('//input[@name="public"]');

    }


    /**
     * A title is required.
     */
    public function testNoTitleError()
    {

        // Missing title.
        $this->request->setMethod('POST')->setPost(array(
            'title'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

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

        // Missing slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

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

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug with spaces'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

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

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

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

        // Spaces.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug-with-non-alphas!'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

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

        // Create an exhibit.
        $exhibit = $this->__exhibit('test-exhibit');

        // Duplicate slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'test-exhibit'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 1);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 1);
        $this->assertAction('add');

        // Should flash error.
        $this->assertXpath('//input[@name="slug"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * A default base layer must be selected.
     */
    public function testNoDefaltLayerError()
    {

        // Missing slug.
        $this->request->setMethod('POST')->setPost(array(
            'base_layer'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->assertAction('add');

        // Should flash error.
        $this->assertXpath('//select[@name="base_layer"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * When all fields are valid, a new exhibit should be created.
     */
    public function testSuccess()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Title',
            'slug'          => 'slug',
            'base_layers'   => array('Layer1', 'Layer2'),
            'base_layer'    => 'Layer2',
            'widgets'       => array('Widget1', 'Widget2'),
            'description'   => 'Description.',
            'public'        => 1
        ));

        // Should create new exhibit.
        $this->assertEquals($this->__exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->__exhibits->count(), 1);

        // Get the new exhibit.
        $exhibit = $this->getLastRow($this->__exhibits);

        // Should set fields.
        $this->assertEquals($exhibit->title,        'Title');
        $this->assertEquals($exhibit->slug,         'slug');
        $this->assertEquals($exhibit->base_layers,  'Layer1,Layer2');
        $this->assertEquals($exhibit->base_layer,   'Layer2');
        $this->assertEquals($exhibit->widgets,      'Widget1,Widget2');
        $this->assertEquals($exhibit->description,  'Description.');
        $this->assertEquals($exhibit->public,       1);

    }


}
