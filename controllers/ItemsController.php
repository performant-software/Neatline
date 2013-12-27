<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ItemsController extends Neatline_Controller_Rest
{


    /**
     * Set the controller model.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineRecord');
        parent::init();
    }


    /**
     * Get the Omeka item content for an individual record.
     * @REST
     */
    public function getAction()
    {
        echo nl_getItemMarkup($this->_helper->db->findById());
    }


}
