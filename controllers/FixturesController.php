<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Markup emitters for Jasmine suite.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_FixturesController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {
        $this->exhibitsTable = $this->_helper->db->getTable('NeatlineExhibit');
    }

    /**
     * Base exhibit markup.
     *
     * @return void
     */
    public function neatlineAction()
    {

        // Supress default layout.
        $this->_helper->viewRenderer->setNoRender(true);

        // Create exhibit.
        $exhibit = new NeatlineExhibit;

        // Render.
        echo $this->view->partial('neatline/_neatline.php', array(
            'exhibit' => $exhibit
        ));

    }

    /**
     * Editor markup.
     *
     * @return void
     */
    public function editorAction()
    {

        // Supress default layout.
        $this->_helper->viewRenderer->setNoRender(true);

        // Create exhibit.
        $exhibit = new NeatlineExhibit;

        // Render.
        echo $this->view->partial('index/_editor.php', array(
            'exhibit' => $exhibit
        ));

    }

}
