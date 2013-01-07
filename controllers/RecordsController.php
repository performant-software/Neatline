<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Records controller. Emulates a REST API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController
    extends Omeka_Controller_AbstractActionController
{


    /**
     * Disable view rendering, set records table.
     */
    public function init()
    {
        $this->__table = $this->_helper->db->getTable('NeatlineRecord');
        $this->_helper->viewRenderer->setNoRender(true);
    }


    /**
     * Get a collection of records.
     */
    public function listAction()
    {

        // Get the exhibit.
        $__exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $exhibit = $__exhibits->find($this->_request->id);

        // Output the JSON string.
        echo Zend_Json::encode($this->__table->queryRecords($exhibit,
            $this->_request->extent,
            $this->_request->zoom
        ));

    }


    /**
     * Forward request to appropriate method action.
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
     */
    public function getAction()
    {
        $id = $this->_request->id;
        echo Zend_Json::encode($this->__table->queryRecord($id));
    }


    /**
     * Create a new record.
     */
    public function postAction()
    {

    }


    /**
     * Update an existing record.
     */
    public function putAction()
    {
        $record = $this->__table->find($this->_request->id);
        $put = file_get_contents(Zend_Registry::get('fileIn'));
        $record->saveForm(Zend_Json::decode($put, true));
    }


    /**
     * Delete a record.
     */
    public function deleteAction()
    {
        $record = $this->__table->find($this->_request->id);
        $record->delete();
    }


}
