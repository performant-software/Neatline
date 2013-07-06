<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_AdminAdd extends Neatline_Case_Default
{


    public function setUp()
    {
        parent::setUp();
        $this->_mockPresenters();
        $this->_mockExhibitWidgets();
        $this->_mockLayers();
    }


    /**
     * ADD should display the add exhibit form.
     */
    public function testBaseMarkup()
    {

        $this->dispatch('neatline/add');

        // Title:
        $this->assertXpath('//input[@name="title"]');

        // Slug:
        $this->assertXpath('//input[@name="slug"]');

        // Narrative:
        $this->assertXpath('//textarea[@name="narrative"]');

        // Widgets:
        $root = '//select[@name="widgets[]"]';
        $this->assertXpath($root.'/option[@value="Widget1"]');
        $this->assertXpath($root.'/option[@value="Widget2"]');
        $this->assertXpath($root.'/option[@value="Widget3"]');

        // Spatial Layers:
        $root = '//select[@name="spatial_layers[]"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Spatial Layer:
        $root = '//select[@name="spatial_layer"]';
        $this->assertXpath($root.'/optgroup[@label="Group1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer1"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer2"]');
        $this->assertXpath($root.'/optgroup[@label="Group2"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer4"]');
        $this->assertXpath($root.'/optgroup[@label="Group3"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer5"]');
        $this->assertXpath($root.'/optgroup/option[@value="Layer6"]');

        // Image Layer:
        $this->assertXpath('//input[@name="image_layer"]');

        // WMS Address:
        $this->assertXpath('//input[@name="wms_address"]');

        // WMS Layers:
        $this->assertXpath('//input[@name="wms_layers"]');

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
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
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
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
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
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
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
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
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
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
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
        $exhibit = $this->_exhibit('test-exhibit');

        // Duplicate slug.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'test-exhibit'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibits->count(), 1);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 1);
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
            'spatial_layer'
        ));

        // Submit the form, check for no new exhibits.
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->assertAction('add');

        // Should flash error.
        $this->assertXpath('//select[@name="spatial_layer"]/
            following-sibling::ul[@class="error"]'
        );

    }


    /**
     * When all fields are valid, a new exhibit should be created.
     */
    public function testSuccess()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'           => 'Title',
            'slug'            => 'slug',
            'narrative'       => 'Narrative.',
            'widgets'         => array('Widget1', 'Widget2'),
            'spatial_layers'  => array('Layer1', 'Layer2'),
            'spatial_layer'   => 'Layer2',
            'image_layer'     => 'img.org',
            'wms_address'     => 'wms.org',
            'wms_layers'      => 'wms:layer',
            'public'          => 1
        ));

        // Should create new exhibit.
        $this->assertEquals($this->_exhibits->count(), 0);
        $this->dispatch('neatline/add');
        $this->assertEquals($this->_exhibits->count(), 1);

        // Get the new exhibit.
        $exhibit = $this->_getLastRow($this->_exhibits);

        // Should set fields.
        $this->assertEquals($exhibit->title,          'Title');
        $this->assertEquals($exhibit->slug,           'slug');
        $this->assertEquals($exhibit->narrative,      'Narrative.');
        $this->assertEquals($exhibit->widgets,        'Widget1,Widget2');
        $this->assertEquals($exhibit->spatial_layers, 'Layer1,Layer2');
        $this->assertEquals($exhibit->spatial_layer,  'Layer2');
        $this->assertEquals($exhibit->image_layer,    'img.org');
        $this->assertEquals($exhibit->wms_address,    'wms.org');
        $this->assertEquals($exhibit->wms_layers,     'wms:layer');
        $this->assertEquals($exhibit->public,         1);

    }


}
