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
        $this->__table = $this->_helper->db->getTable('NeatlineRecord');
        $this->__exhib = $this->_helper->db->getTable('NeatlineExhibit');
        $this->exhibit = $this->__exhib->find($this->_request->id);
        parent::init();
    }


    /**
     * Get a record collection.
     */
    public function getAction()
    {
        echo Zend_Json::encode(
            $this->__table->queryRecords($this->exhibit,
                $this->_request->extent,
                $this->_request->zoom
            )
        );
    }


    /**
     * Create a new record.
     */
    public function postAction()
    {
        // Create record.
        $record = new NeatlineRecord($this->exhibit);
        $record->save();

        // Forward to records GET.
        $this->_forward('get', 'record', 'neatline', array(
            'id' => $record->id
        ));

    }


}
