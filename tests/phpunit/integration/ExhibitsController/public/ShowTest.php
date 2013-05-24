<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class ExhibitsControllerTest_PublicShow extends Neatline_DefaultCase
{


    protected $_isAdminTest = false;


    public function setUp()
    {
        parent::setUp();
        $this->mockTheme();
    }


    /**
     * SHOW should load exhibits by slug.
     */
    public function testLoadExhibit()
    {
        $exhibit = $this->__exhibit('slug');
        $this->dispatch('neatline/show/slug');
        $this->assertEquals(nl_getExhibitField('id'), $exhibit->id);
    }


    /**
     * When no custon exhibit template is provided, SHOW should render the
     * default `show` template from the plugin.
     */
    public function testDefaultTemplate()
    {
        $exhibit = $this->__exhibit('slug');
        $this->dispatch('neatline/show/slug');
        $this->assertQuery('#neatline');
    }


    /**
     * When a custom template is provided, SHOW should render the exhibit-
     * specific template instead of the default.
     */
    public function testCustomTemplate()
    {
        $exhibit = $this->__exhibit('custom');
        $this->dispatch('neatline/show/custom');
        $this->assertQueryContentContains('h1', 'custom');
    }


}
