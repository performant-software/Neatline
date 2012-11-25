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
        $this->getResponse()->setBody('test');
        $this->getResponse()->setHttpResponseCode(200);
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
