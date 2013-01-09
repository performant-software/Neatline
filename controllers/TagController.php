<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tags controller. Emulates a REST API.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_TagController extends Neatline_RestController
{


    /**
     * Get tags table.
     */
    public function init()
    {
        $this->__table = $this->_helper->db->getTable('NeatlineTag');
        parent::init();
    }


    /**
     * Get an individual tag.
     */
    public function getAction()
    {
        $tag = $this->__table->find($this->_request->id);
        echo Zend_Json::encode($tag->toArray());
    }


    /**
     * Update an existing tag.
     */
    public function putAction()
    {
        $tag = $this->__table->find($this->_request->id);
        $put = file_get_contents(Zend_Registry::get('fileIn'));
        $tag->saveForm(Zend_Json::decode($put, true));
    }


    /**
     * Delete a tag.
     */
    public function deleteAction()
    {
        $tag = $this->__table->find($this->_request->id);
        $tag->delete();
    }
}
