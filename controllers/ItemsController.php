<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ItemsController extends Neatline_Controller_Rest
{


    /**
     * Set the controller model.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('Item');
        parent::init();
    }


    /**
     * Get the compiled metadata for an individual Omeka item.
     * @REST
     */
    public function getAction()
    {

        // Load the Omeka item.
        $item = $this->_helper->db->findById();
        $record = null;

        // If a record is specified, load it.
        if (!is_null($this->_request->record)) {
            $rTable = $this->_helper->db->getTable('NeatlineRecord');
            $record = $rTable->find($this->_request->record);
        }

        // Output the item metadata
        echo nl_getItemMarkup($item, $record);

    }


}
