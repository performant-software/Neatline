<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Add/Edit/Delete exhibits.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsController extends Neatline_RestController
{


    /**
     * Set default model and pagination page length.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineExhibit');
        $this->_table = $this->_helper->db->getTable('NeatlineExhibit');
        $this->_browseRecordsPerPage = get_option('per_page_admin');
    }


    /**
     * Update exhibit via PUT.
     * @backbone
     */
    public function putAction()
    {

        $this->_helper->viewRenderer->setNoRender(true);

        // Update the exhibit.
        $exhibit = $this->_helper->db->findById();
        $exhibit->saveForm(Zend_Json::decode(file_get_contents(
            Zend_Registry::get('fileIn')), true
        ));

        // Propagate CSS.
        $exhibit->pushStyles();

    }


    /**
     * Load exhibit via GET.
     * @backbone
     */
    public function getAction()
    {
        $this->_helper->viewRenderer->setNoRender(true);
        $exhibit = $this->_helper->db->findById();
        echo Zend_Json::encode($exhibit->toArray());
    }


    /**
     * Create a new exhibit.
     */
    public function addAction()
    {

        $exhibit = new NeatlineExhibit;
        $form = $this->_getExhibitForm($exhibit);

        if ($this->_request->isPost()) {
            if ($form->isValid($this->_request->getPost())) {
                $exhibit->saveForm($form->getValues());
                $this->_redirect('neatline');
            }
        }

        $this->view->form = $form;

    }


    /**
     * Edit exhibit settings.
     */
    public function editAction()
    {

        $exhibit = $this->_helper->db->findById();
        $form = $this->_getExhibitForm($exhibit);

        if ($this->_request->isPost()) {
            if ($form->isValid($this->_request->getPost())) {
                $exhibit->saveForm($form->getValues());
                $this->_redirect('neatline');
            }
        }

        $this->view->neatline_exhibit = $exhibit;
        $this->view->form = $form;

    }


    /**
     * Import items from Omeka.
     */
    public function importAction()
    {

        $exhibit = $this->_helper->db->findById();

        if ($this->_request->isPost()) {

            // Save the query.
            $post = $this->_request->getPost();
            $exhibit->query = serialize($post);
            $exhibit->save();

            // Import items.
            Zend_Registry::get('bootstrap')->getResource('jobs')->
                sendLongRunning('Job_ItemImporter', array(
                    'exhibit_id' => $exhibit->id,
                    'query' => $post
                )
            );

        }

        // Show query.
        $query = unserialize($exhibit->query);
        $_REQUEST = $query; $_GET = $query;

    }


    /**
     * Edit exhibit.
     */
    public function editorAction()
    {
        $this->view->neatline_exhibit = $this->_helper->db->findById();
    }


    /**
     * Show exhibit.
     */
    public function showAction()
    {
        $exhibit = $this->_table->findBySlug($this->_request->slug);
        $this->view->neatline_exhibit = $exhibit;
    }


    /**
     * Sets the add success message.
     */
    protected function _getAddSuccessMessage($exhibit)
    {
        return __('The Neatline "%s" was successfully added!',
            $exhibit->title);
    }


    /**
     * Sets the edit success message.
     */
    protected function _getEditSuccessMessage($exhibit)
    {
        return __('The Neatline "%s" was successfully changed!',
            $exhibit->title);
    }


    /**
     * Sets the delete success message.
     */
    protected function _getDeleteSuccessMessage($exhibit)
    {
        return __('The Neatline "%s" was successfully deleted!',
            $exhibit->title);
    }


    /**
     * Sets the delete confirm message.
     */
    protected function _getDeleteConfirmMessage($exhibit)
    {
      return __('This will delete "%s" and its associated metadata.',
        $exhibit->title);
    }


    /**
     * Construct the details form.
     */
    private function _getExhibitForm($exhibit)
    {
        return new Neatline_ExhibitForm(array(
            'exhibit' => $exhibit
        ));
    }


}
