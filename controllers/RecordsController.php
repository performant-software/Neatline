<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Records controller. Emulates a REST API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController extends Omeka_Controller_AbstractActionController
{

    /**
     * Disable view rendering.
     *
     * @return void.
     */
    public function init()
    {

        // Disable view rendering, set content type.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get models.
        $this->__records = $this->_helper->db->getTable('NeatlineRecord');
        $this->__exhibits = $this->_helper->db->getTable('NeatlineExhibit');

    }

    /**
     * Get a collection of records.
     *
     * @return void.
     */
    public function listAction()
    {

        // Get the exhibit.
        $exhibit = $this->__exhibits->find($this->_request->id);

        // Output the JSON string.
        echo Zend_Json::encode($this->__records->queryRecords($exhibit,
            $this->_request->extent,
            $this->_request->zoom
        ));

    }

    /**
     * Forward request to appropriate method action.
     *
     * @return void.
     */
    public function indexAction()
    {

        // Get the request method.
        $method = $this->getRequest()->getMethod();

        switch($method) {

            case 'GET':
                $this->_forward('get');
                break;

            case 'POST':
                $this->_forward('post');
                break;

            case 'PUT':
                $this->_forward('put');
                break;

            case 'DELETE':
                $this->_forward('delete');
                break;

        }

    }

    /**
     * Get an individual record.
     *
     * @return void.
     */
    public function getAction()
    {
        $id = $this->_request->id;
        echo Zend_Json::encode($this->__records->queryRecord($id));
    }

    /**
     * Create a new record.
     *
     * @return void.
     */
    public function postAction()
    {

    }

    /**
     * Update an existing record.
     *
     * @return void.
     */
    public function putAction()
    {
        $record = $this->__records->find($this->_request->id);
        $put = file_get_contents(Zend_Registry::get('fileIn'));
        $record->update(Zend_Json::decode($put, true));
    }

    /**
     * Delete a record.
     *
     * @return void.
     */
    public function deleteAction()
    {

    }

}
