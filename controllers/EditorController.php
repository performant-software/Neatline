<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Editor actions.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_EditorController
    extends Omeka_Controller_AbstractActionController
{


    /**
     * Set default model and pagination page length.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineExhibit');
    }


    /**
     * Edit exhibit.
     */
    public function indexAction()
    {
        $this->view->exhibit = $this->_helper->db->findById();
    }


    /**
     * Save exhibit styles.
     */
    public function stylesAction()
    {

        $this->_helper->viewRenderer->setNoRender(true);

        // Save the YAML.
        $exhibit = $this->_helper->db->findById();
        $exhibit->styles = $this->_request->getRawBody();
        $exhibit->save();

        // Apply the styles.
        $records = $this->_helper->db->getTable('NeatlineRecord');
        $records->applyStyles($exhibit);


    }


}
