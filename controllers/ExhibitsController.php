<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
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
        $this->exhibits = $this->_helper->db->getTable('NeatlineExhibit');
    }


    /**
     * Update exhibit via PUT.
     * @REST
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
     * Fetch exhibit via GET.
     * @REST
     */
    public function getAction()
    {
        $this->_helper->viewRenderer->setNoRender(true);
        echo Zend_Json::encode($this->_helper->db->findById()->toArray());
    }


    /**
     * Browse exhibits.
     */
    public function browseAction()
    {
        $this->_setParam('sort_field', 'added');
        $this->_setParam('sort_dir', 'd');
        parent::browseAction();
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
                $this->_helper->redirector('browse');
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
                $this->_helper->redirector('browse');
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
            Zend_Registry::get('job_dispatcher')->sendLongRunning(
                'Neatline_ImportItems', array(
                    'web_dir'       => nl_getWebDir(),
                    'exhibit_id'    => $exhibit->id,
                    'query'         => $post
                )
            );

            // Flash success.
            $this->_helper->flashMessenger(
                $this->_getImportStartedMessage(), 'success'
            );

            // Redirect to browse.
            $this->_helper->redirector('browse');

        }

        // Populate query.
        $query = unserialize($exhibit->query);
        $_REQUEST = $query; $_GET = $query;

    }


    /**
     * Show exhibit.
     */
    public function showAction()
    {
        $exhibit = $this->exhibits->findBySlug($this->_request->slug);
        $this->view->neatline_exhibit = $exhibit;
    }


    /**
     * Edit exhibit.
     */
    public function editorAction()
    {
        $this->view->neatline_exhibit = $this->_helper->db->findById();
    }


    /**
     * Return the pagination page length.
     */
    protected function _getBrowseRecordsPerPage()
    {
        if (is_admin_theme()) return (int) get_option('per_page_admin');
        else return (int) get_option('per_page_public');
    }


    /**
     * Set the delete success message.
     *
     * @param NeatlineExhibit $exhibit
     */
    protected function _getDeleteSuccessMessage($exhibit)
    {
        return __('The exhibit "%s" was successfully deleted!',
            $exhibit->title
        );
    }


    /**
     * Set the delete confirm message.
     *
     * @param NeatlineExhibit $exhibit
     */
    protected function _getDeleteConfirmMessage($exhibit)
    {
      return __('This will delete "%s" and its associated metadata.',
          $exhibit->title
      );
    }


    /**
     * Set the import started message.
     */
    protected function _getImportStartedMessage()
    {
        return __('The item import was successfully started!');
    }


    /**
     * Construct the details form.
     *
     * @param NeatlineExhibit $exhibit
     */
    private function _getExhibitForm($exhibit)
    {
        return new Neatline_ExhibitForm(array('exhibit' => $exhibit));
    }


}
