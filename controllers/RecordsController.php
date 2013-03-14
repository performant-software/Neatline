<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Records REST controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController extends Neatline_RestController
{


    /**
     * Get records table.
     */
    public function init()
    {
        $this->records  = $this->_helper->db->getTable('NeatlineRecord');
        $this->exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        parent::init();
    }


    /**
     * Get a record collection.
     */
    public function listAction()
    {

        // Load exhibit.
        $exhibit = $this->exhibits->find($this->_request->exhibit_id);

        // Load records.
        echo Zend_Json::encode(
            $this->records->queryRecords($exhibit, array(
                'extent'    => $this->_request->extent,
                'zoom'      => $this->_request->zoom,
                'offset'    => $this->_request->offset,
                'limit'     => $this->_request->limit,
                'query'     => $this->_request->query,
                'tags'      => $this->_request->tags
            ))
        );

    }


    /**
     * Get an individual record.
     */
    public function getAction()
    {
        echo Zend_Json::encode($this->records->queryRecord(
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
     */
    public function deleteAction()
    {
        $record = $this->records->find($this->_request->id);
        $record->delete();
    }


}
