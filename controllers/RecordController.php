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

class Neatline_RecordController extends Neatline_RestController
{


    /**
     * Get records table.
     */
    public function init()
    {
        $this->_table = $this->_helper->db->getTable('NeatlineRecord');
        parent::init();
    }


    /**
     * Get an individual record.
     */
    public function getAction()
    {
        echo Zend_Json::encode($this->_table->queryRecord(
            $this->_request->id
        ));
    }


    /**
     * Create a record.
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
     */
    public function putAction()
    {

        // Find the record.
        $record = $this->_table->find($this->_request->id);

        // Decode and save PUT body.
        $record->saveForm(Zend_Json::decode(file_get_contents(
            Zend_Registry::get('fileIn')), true
        ));

        // Forward to GET.
        $this->getAction();

    }


    /**
     * Delete a record.
     */
    public function deleteAction()
    {
        $record = $this->_table->find($this->_request->id);
        $record->delete();
    }


}
