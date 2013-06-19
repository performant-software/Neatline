<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController extends Neatline_Controller_Rest
{


    /**
     * Get records table.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineRecord');
        $this->exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $this->records  = $this->_helper->db->getTable('NeatlineRecord');
        parent::init();
    }


    /**
     * Get a collection of records.
     * @REST
     */
    public function listAction()
    {

        // Load exhibit.
        $exhibit = $this->exhibits->find($this->_request->exhibit_id);

        // Query records.
        echo Zend_Json::encode($this->records->queryRecords(
            $exhibit, $this->_request->getParams()
        ));

    }


    /**
     * Get an individual record.
     * @REST
     */
    public function getAction()
    {
        echo Zend_Json::encode($this->_helper->db->findById()->toArray());
    }


    /**
     * Create a record.
     * @REST
     */
    public function postAction()
    {

        // Create record.
        $record = new NeatlineRecord();
        $post = Zend_Json::decode($this->_request->getRawBody());
        $record->saveForm($post);

        // Forward to GET.
        $this->_request->setParam('id', $record->id);
        $this->getAction();

    }


    /**
     * Update a record.
     * @REST
     */
    public function putAction()
    {

        // Find the record.
        $record = $this->records->find($this->_request->id);

        // Decode and save PUT body.
        $record->saveForm(Zend_Json::decode(file_get_contents(
            Zend_Registry::get('fileIn')), true
        ));

        // Forward to GET.
        $this->getAction();

    }


    /**
     * Delete a record.
     * @REST
     */
    public function deleteAction()
    {
        $record = $this->records->find($this->_request->id);
        $record->delete();
    }


    /**
     * TODO|dev.
     * @REST
     */
    public function debugAction()
    {
        echo $this->_helper->acl->getResourceName();
    }


}
