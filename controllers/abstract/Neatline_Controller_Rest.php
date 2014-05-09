<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Controller_Rest
    extends Omeka_Controller_AbstractActionController
{


    /**
     * Disable view rendering.
     */
    public function init()
    {
        $this->_helper->viewRenderer->setNoRender(true);
    }


    /**
     * Forward request to appropriate method action.
     */
    public function indexAction()
    {

        $method = $this->getRequest()->getMethod();

        switch($method) {

            case 'GET':
                if ($this->_request->id) $this->_forward('get');
                else $this->_forward('list');
                break;

            case 'POST':
                $this->_forward('post');
                break;

            case 'PUT':
                $this->_forward('put');
                break;

            case 'DELETE':
                $this->_forward('delete');
                break;

        }

    }


}
