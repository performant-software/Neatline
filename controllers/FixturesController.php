<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Markup constructor actions for Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_FixturesController
    extends Omeka_Controller_AbstractActionController
{


    /**
     * Create an exhibit.
     */
    public function init()
    {
        $this->_helper->viewRenderer->setNoRender(true);
        $this->exhibit = new NeatlineExhibit();
        $this->exhibit->base_layer  = 'OpenStreetMap';
        $this->exhibit->slug        = 'slug';
        $this->exhibit->save();
    }


    /**
     * Generate exhibit markup.
     */
    public function neatlineAction()
    {
        echo $this->view->partial('neatline/_neatline.php', array(
            'exhibit' => $this->exhibit
        ));
    }


    /**
     * Generate editor markup.
     */
    public function editorAction()
    {
        echo $this->view->partial('exhibits/_editor.php', array(
            'exhibit' => $this->exhibit
        ));
    }


}
