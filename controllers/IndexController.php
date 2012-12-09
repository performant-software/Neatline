<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Controller for exhibit create, edit, and delete.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexController
    extends Omeka_Controller_AbstractActionController
{


    /**
     * Set default model and pagination page length.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineExhibit');
        $this->_browseRecordsPerPage = get_option('per_page_admin');
    }


    /**
     * Create a new exhibit.
     */
    public function addAction()
    {

        // Construct add form.
        $neatline = new NeatlineExhibit;
        $form = $this->_getNeatlineDetailsForm($neatline);
        $this->view->form = $form;

        // If form is posted.
        if ($this->_request->isPost()) {

            // Validate form.
            if ($form->isValid($_POST)) {

                // Save and redirect.
                $neatline->saveForm($form->getValues());
                $this->_redirect('neatline');

            }

        }

    }


    /**
     * Edit exhibit settings.
     */
    public function editAction()
    {

        // Get the exhibit.
        $neatline = $this->_helper->db->findById();
        $form = $this->_getNeatlineDetailsForm($neatline);

        // If form is posted.
        if ($this->_request->isPost()) {

            // Validate the form.
            if ($form->isValid($this->_request->getPost())) {

                // Save and redirect.
                $neatline->saveForm($form->getValues());
                $this->_redirect('neatline');

            }

        }

        // Push form and exhibit to view.
        $this->view->neatline_exhibit = $neatline;
        $this->view->form = $form;

    }


    /**
     * Edit items query.
     */
    public function queryAction()
    {

        // Get the exhibit.
        $neatline = $this->_helper->db->findById();

        // Save query.
        if(isset($_GET['search'])) {
            $neatline->query = serialize($_GET);
            $neatline->save();
            $this->_helper->redirector('browse');
        } else {
            $queryArray = unserialize($neatline->query);
            $_GET = $queryArray;
            $_REQUEST = $queryArray;
        }

        // Push exhibit to view.
        $this->view->neatline_exhibit = $neatline;

    }


    /**
     * Edit an exhibit.
     *
     * @return void
     */
    public function editorAction()
    {
        $id = $this->_request->getParam('id');
        $__exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $this->view->exhibit = $__exhibits->find($id);
    }


    /**
     * Default exhibit show view.
     */
    public function showAction()
    {
        $neatline = $this->_findExhibit();
        $this->view->neatline_exhibit = $neatline;
    }


    /**
     * Sets the add success message.
     */
    protected function _getAddSuccessMessage($neatline)
    {
        return __('The Neatline "%s" was successfully added!',
            $neatline->title);
    }


    /**
     * Sets the edit success message.
     */
    protected function _getEditSuccessMessage($neatline)
    {
        return __('The Neatline "%s" was successfully changed!',
            $neatline->title);
    }


    /**
     * Sets the delete success message.
     */
    protected function _getDeleteSuccessMessage($neatline)
    {
        return __('The Neatline "%s" was successfully deleted!',
            $neatline->title);
    }


    /**
     * Sets the delete confirm message.
     */
    protected function _getDeleteConfirmMessage($neatline)
    {
      return __('This will delete "%s" and its associated metadata.',
        $neatline->title);
    }


    /**
     * Construct the details form.
     */
    private function _getNeatlineDetailsForm(NeatlineExhibit $neatline)
    {
        return new Neatline_Form_NeatlineDetails(array(
            'neatline' => $neatline
        ));
    }


    /**
     * Find the Neatline exhbit associated with the current request. If
     * there is a `slug` parameter, find the exhibit record with the slug;
     * if not, fall back on Omeka_Controller_Action::findById().
     *
     * @throws Omeka_Controller_Exception_404
     * @return NeatlineExhibit
     */
    private function _findExhibit()
    {

        // Get the exhibit.
        $__exhibits = $this->_helper->db->getTable('NeatlineExhibit');
        $record = $__exhibits->findBySlug($this->_request->slug);

        // Catch invalid slug.
        if (!$record) { throw new Omeka_Controller_Exception_404(
            get_class($this) . ": No record with Slug '$slug' exists"
        );}

        return $record;

    }


}
