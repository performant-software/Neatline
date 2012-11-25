<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Abstract REST API; implements init, head, and options.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Rest_Controller extends Zend_Rest_Controller
{

    /**
     * Disable view rendering.
     *
     * @return void.
     */
    public function init()
    {

        // Disable view rendering, set content type.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get models.
        $this->__records = $this->_helper->db->getTable('NeatlineRecord');
        $this->__exhibits = $this->_helper->db->getTable('NeatlineExhibit');

    }

    /**
     * Set empty body.
     *
     * @return void.
     */
    public function headAction()
    {
        $this->getResponse()->setBody(null);
    }

    /**
     * Set options.
     *
     * @return void.
     */
    public function optionsAction()
    {
        $this->getResponse()->setBody(null);
        $this->getResponse()->setHeader('Allow',
            'OPTIONS, HEAD, INDEX, GET, POST, PUT, DELETE');
    }

}
