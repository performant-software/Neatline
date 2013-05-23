<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class AclTest_ResearcherExhibit extends Neatline_DefaultCase
{


    public function setUp()
    {

        parent::setUp();
        $this->mockPresenters();
        $this->mockExhibitWidgets();
        $this->mockLayers();

        $this->loginAsResearcher();
        $this->exhibit = $this->__exhibit('slug');

    }


    /**
     * Researchers should be able to edit settings for their exhibits.
     */
    public function testAllowEditSelf()
    {

        $this->request->setMethod('POST')->setPost(array(
            'title'         => 'Title 2',
            'slug'          => 'slug-2',
            'base_layers'   => array('Layer1', 'Layer2'),
            'base_layer'    => 'Layer2',
            'widgets'       => array('Widget1', 'Widget2'),
            'narrative'     => 'Narrative 2.',
            'public'        => 1
        ));

        $this->dispatch('neatline/edit/'.$this->exhibit->id);
        $exhibit = $this->reload($this->exhibit);
        $this->assertEquals($exhibit->title, 'Title 2');

    }


    /**
     * Researchers should be able to open the editor for their exhibits.
     */
    public function testAllowEditorSelf()
    {
        $this->dispatch('neatline/editor/'.$this->exhibit->id);
        $this->assertEquals(nl_getExhibitField('id'), $this->exhibit->id);
    }


    /**
     * Researchers should be able to update their own exhibits.
     */
    public function testAllowPutSelf()
    {
        $this->writePut(array('title' => 'title'));
        $this->dispatch('neatline/exhibits/'.$this->exhibit->id);
        $this->exhibit = $this->reload($this->exhibit);
        $this->assertEquals($this->exhibit->title, 'title');
    }


}
