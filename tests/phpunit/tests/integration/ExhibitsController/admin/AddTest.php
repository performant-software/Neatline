<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

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
     * Submit the form, confirm that a new exhibit was not added.
     *
     * @param string $name The `name` attribute of the input with the error.
     * @param string $element The input element type.
     */
    protected function _assertFormError($name, $element='input')
    {

        // Submit the form.
        $c1 = $this->_exhibits->count();
        $this->dispatch('neatline/add');
        $c2 = $this->_exhibits->count();

        // Should not add exhibit.
        $this->assertEquals($c1, $c2);
        $this->assertAction('add');

        // Should flash error.
        $this->assertXpath( "//{$element}[@name='$name']
            /following-sibling::ul[@class='error']"
        );

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

        // Zoom Levels (with default):
        $this->assertXpath('//input[@name="zoom_levels"][@value="20"]');

        // WMS Address:
        $this->assertXpath('//input[@name="wms_address"]');

        // WMS Layers:
        $this->assertXpath('//input[@name="wms_layers"]');

        // Spatial Querying:
        $this->assertXpath('//input[@name="spatial_querying"]');

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

        $this->_assertFormError('title');

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

        $this->_assertFormError('slug');

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

        $this->_assertFormError('slug');

    }


    /**
     * The slug cannot have capitals.
     */
    public function testInvalidSlugWithCapsError()
    {

        // Capitals.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'Slug-With-Capitals'
        ));

        $this->_assertFormError('slug');

    }


    /**
     * The slug cannot have non-alphanumeric characters.
     */
    public function testInvalidSlugWithNonAlphasError()
    {

        // Non-alphanumerics.
        $this->request->setMethod('POST')->setPost(array(
            'slug' => 'slug-with-non-alphas!'
        ));

        $this->_assertFormError('slug');

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

        $this->_assertFormError('slug');

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

        $this->_assertFormError('spatial_layer', 'select');

    }


    /**
     * A zoom level count must be provided.
     */
    public function testNoZoomLevelsError()
    {

        // Missing zoom level count.
        $this->request->setMethod('POST')->setPost(array(
            'zoom_levels'
        ));

        $this->_assertFormError('zoom_levels');

    }


    /**
     * The zoom level count can't contain non-digits.
     */
    public function testAlphaZoomLevelsError()
    {

        // Missing zoom level count.
        $this->request->setMethod('POST')->setPost(array(
            'zoom_levels' => 'alpha'
        ));

        $this->_assertFormError('zoom_levels');

    }


    /**
     * The zoom level count can't contain decimals.
     */
    public function testDecimalZoomLevelsError()
    {

        // Missing zoom level count.
        $this->request->setMethod('POST')->setPost(array(
            'zoom_levels' => '50.5'
        ));

        $this->_assertFormError('zoom_levels');

    }


    /**
     * When all fields are valid, a new exhibit should be created.
     */
    public function testSuccess()
    {

        $image = NL_TEST_DIR.'/mocks/image.jpg';

        $this->request->setMethod('POST')->setPost(array(
            'title'             => 'Title',
            'slug'              => 'slug',
            'narrative'         => 'Narrative.',
            'widgets'           => array('Widget1', 'Widget2'),
            'spatial_layers'    => array('Layer1', 'Layer2'),
            'spatial_layer'     => 'Layer2',
            'image_layer'       => $image,
            'zoom_levels'       => '50',
            'wms_address'       => 'wms.org',
            'wms_layers'        => 'wms:layer',
            'spatial_querying'  => 1,
            'public'            => 1
        ));

        // Should create new exhibit.
        $this->assertEquals(0, $this->_exhibits->count());
        $this->dispatch('neatline/add');
        $this->assertEquals(1, $this->_exhibits->count());

        // Get the new exhibit.
        $exhibit = $this->_getLastRow($this->_exhibits);

        // Should set fields.
        $this->assertEquals('Title',            $exhibit->title);
        $this->assertEquals('slug',             $exhibit->slug);
        $this->assertEquals('Narrative.',       $exhibit->narrative);
        $this->assertEquals('Widget1,Widget2',  $exhibit->widgets);
        $this->assertEquals('Layer1,Layer2',    $exhibit->spatial_layers);
        $this->assertEquals('Layer2',           $exhibit->spatial_layer);
        $this->assertEquals($image,             $exhibit->image_layer);
        $this->assertEquals(50,                 $exhibit->zoom_levels);
        $this->assertEquals('wms.org',          $exhibit->wms_address);
        $this->assertEquals('wms:layer',        $exhibit->wms_layers);
        $this->assertEquals(1,                  $exhibit->spatial_querying);
        $this->assertEquals(1,                  $exhibit->public);

    }


}
