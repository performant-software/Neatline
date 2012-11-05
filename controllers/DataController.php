<?php
/**
 * Data emitter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_DataController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get tables.
     *
     * @return void
     */
    public function init()
    {
        $this->exhibitsTable =  $this->_helper->db->getTable('NeatlineExhibit');
        $this->recordsTable =   $this->_helper->db->getTable('NeatlineRecord');
    }

    /**
     * ~ AJAX ~
     * Get data records for an exhibit.
     *
     * @return JSON The vector data.
     */
    public function recordsAction()
    {

        // Supress the default layout.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get the exhibit.
        $exhibit = $this->exhibitsTable->find($this->_request->id);

        // Output the JSON string.
        echo json_encode($this->recordsTable->buildJsonForExhibit($exhibit));

    }

}
