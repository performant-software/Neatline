<?php
/**
 * Data emitter.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get tables.
     *
     * @return void
     */
    public function init()
    {
        $this->_exhibits = $this->_helper->db->getTable('NeatlineExhbits');
        $this->_records = $this->_helper->db->getTable('NeatlineDataRecord');
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
        $exhibit = $this->_exhibits->find($this->_request->exhibit_id);

        // Output the JSON string.
        echo $this->_recordsTable->buildRecordsJson($exhibit);

    }

}
