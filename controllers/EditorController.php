<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Editor controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get table managers.
     *
     * @return void
     */
    public function init()
    {
        $this->layersTable = $this->_helper->db->getTable('NeatlineLayer');
        $this->exhibitsTable = $this->_helper->db->getTable('NeatlineExhibit');
        $this->recordsTable = $this->_helper->db->getTable('NeatlineRecord');
    }

    /**
     * Run the editor application.
     *
     * @return void
     */
    public function indexAction()
    {
        $id = $this->_request->getParam('id');
        $this->view->exhibit = $this->exhibitsTable->find($id);
        $this->view->layers = $this->layersTable->findAll();
    }

    /**
     * ~ AJAX ~
     * Fetch records for the browser.
     *
     * @return void
     */
    public function recordsAction()
    {

        // Supress the default layout.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get exhibit.
        $exhibit = $this->exhibitsTable->find($this->_request->id);

        // Get records.
        echo json_encode($this->recordsTable->buildJsonForEditor(
            $exhibit, $this->_request->query, (int) $this->_request->page
        ));

    }

}
