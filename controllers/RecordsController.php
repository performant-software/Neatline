<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Records API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_RecordsController extends Neatline_Rest_Controller
{

    /**
     * Get a collection of records.
     *
     * @return void.
     */
    public function indexAction()
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
     * Get an individual record.
     *
     * @return void.
     */
    public function getAction()
    {

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
        $put = file_get_contents(Zend_Registry::get('fileIn'));
        $this->__records->updateRecord(Zend_Json::decode($put, true));
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
