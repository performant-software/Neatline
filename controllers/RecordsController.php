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
     * Get a record collection.
     */
    public function getAction()
    {

        $records  = $this->_helper->db->getTable('NeatlineRecord');
        $exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $exhibit  = $exhibits->find($this->_request->id);

        echo Zend_Json::encode(
            $records->queryRecords($exhibit,
                $this->_request->extent,
                $this->_request->zoom
            )
        );

    }


}
