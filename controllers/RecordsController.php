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

class Neatline_RecordsController extends Neatline_RestController
{


    /**
     * Get records table.
     */
    public function init()
    {
        $this->records  = $this->_helper->db->getTable('NeatlineRecord');
        $this->exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $this->exhibit  = $this->exhibits->find($this->_request->id);
        parent::init();
    }


    /**
     * Get a record collection.
     */
    public function getAction()
    {
        echo Zend_Json::encode(
            $this->records->queryRecords($this->exhibit, array(
                'extent'    => $this->_request->extent,
                'zoom'      => $this->_request->zoom,
                'offset'    => $this->_request->offset,
                'limit'     => $this->_request->limit,
                'query'     => $this->_request->query,
                'tags'      => $this->_request->tags
            ))
        );
    }


}
