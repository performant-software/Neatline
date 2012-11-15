<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Admin controller.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_IndexController extends Omeka_Controller_AbstractActionController
{

    /**
     * Get tables.
     *
     * @return void
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineExhibit');
        $this->_browseRecordsPerPage = get_option('per_page_admin');
        $this->recordsTable = $this->_helper->db->getTable('NeatlineRecord');
        $this->exhibitsTable = $this->_helper->db->getTable('NeatlineExhibit');
    }

    /**
     * Create a new exhibit.
     *
     * @return void
     */
    public function addAction()
    {
        $neatline = new NeatlineExhibit;
        $form = $this->_getNeatlineDetailsForm($neatline);
        $this->view->form = $form;

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
     * Edit an exhibit.
     *
     * @return void
     */
    public function editAction()
    {

        // Get the exhibit.
        $neatline = $this->_helper->db->findById();
        $form = $this->_getNeatlineDetailsForm($neatline);

        if ($this->_request->isPost()) {

            // Validate the form.
            if ($form->isValid($this->_request->getPost())) {

                // Save and redirect.
                $neatline->saveForm($form->getValues());
                $this->_redirect('neatline');

            }

        }

        // Push exhibit and form.
        $this->view->neatline_exhibit = $neatline;
        $this->view->form = $form;

    }

    /**
     * Edit items query.
     *
     * @return void
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

        $this->view->neatline_exhibit = $neatline;

    }

    /**
     * Default exhibit show view.
     *
     * @return void
     */
    public function showAction()
    {
        $neatline = $this->_findExhibit();
        $this->view->neatline_exhibit = $neatline;
    }

    /**
     * ~ AJAX ~
     * Get data records for an exhibit.
     *
     * @return JSON The vector data.
     */
    public function recordsAction()
    {

        // Supress the default layout.
        $this->_helper->viewRenderer->setNoRender(true);
        $this->getResponse()->setHeader('Content-type', 'application/json');

        // Get the exhibit.
        $exhibit = $this->exhibitsTable->find($this->_request->id);

        // Output the JSON string.
        echo json_encode($this->recordsTable->buildRecordCollection(
            $exhibit, $this->_request->query, (int) $this->_request->page
        ));

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
        $form = new Neatline_Form_NeatlineDetails(array('neatline' => $neatline));
        return $form;
    }

    /**
     * Checks for existence of 'slug' in URL, then tries to find a Neatline
     * record with that slug. If there is no 'slug' parameter, it falls back
     * to Omeka_Controller_Action::findById()
     *
     * @throws Omeka_Controller_Exception_404
     * @return NeatlineExhibit
     */
    private function _findExhibit()
    {

        // Get the exhibit.
        $record = $this->exhibitsTable->findBySlug($this->_request->slug);

        // Catch invalid slug.
        if (!$record) { throw new Omeka_Controller_Exception_404(
            get_class($this) . ": No record with Slug '$slug' exists"
        );}

        return $record;

    }

}
