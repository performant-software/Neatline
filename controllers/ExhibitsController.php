<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_ExhibitsController extends Neatline_Controller_Rest
{


    /**
     * Set the default model, get tables.
     */
    public function init()
    {
        $this->_helper->db->setDefaultModelName('NeatlineExhibit');
        $this->_exhibits = $this->_helper->db->getTable('NeatlineExhibit');
    }


    // REST API:
    // ------------------------------------------------------------------------


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

        // Respond with exhibit data.
        echo Zend_Json::encode($exhibit->toArray());

    }


    // Admin CRUD actions:
    // ------------------------------------------------------------------------


    /**
     * Browse exhibits.
     */
    public function browseAction()
    {

        // By default, sort by added date.
        if (!$this->_getParam('sort_field')) {
            $this->_setParam('sort_field', 'added');
            $this->_setParam('sort_dir', 'd');
        }

        parent::browseAction();

    }


    /**
     * Create a new exhibit.
     */
    public function addAction()
    {

        $exhibit = new NeatlineExhibit;
        $form = $this->_getExhibitForm($exhibit);

        // Process form submission.
        if ($this->_request->isPost() && $form->isValid($_POST)) {
            $exhibit->saveForm($form->getValues());
            $this->_helper->redirector('browse');
        }

        // Push form to view.
        $this->view->form = $form;

        // Queue JS/CSS.
        nl_queueAddForm();

    }


    /**
     * Edit exhibit settings.
     */
    public function editAction()
    {

        $exhibit = $this->_helper->db->findById();
        $form = $this->_getExhibitForm($exhibit);

        // Process form submission.
        if ($this->_request->isPost() && $form->isValid($_POST)) {
            $exhibit->saveForm($form->getValues());
            $this->_helper->redirector('browse');
        }

        // Push exhibit and form to view.
        $this->view->neatline_exhibit = $exhibit;
        $this->view->form = $form;

        // Queue JS/CSS.
        nl_queueEditForm();

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
            $exhibit->item_query = serialize($post);
            $exhibit->save();

            // Import items.
            Zend_Registry::get('job_dispatcher')->sendLongRunning(
                'Neatline_Job_ImportItems', array(
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
        $query = unserialize($exhibit->item_query);
        $_REQUEST = $query; $_GET = $query;

    }


    /**
     * Edit exhibit.
     */
    public function editorAction()
    {

        // Assign exhibit to view.
        $exhibit = $this->_helper->db->findById();
        $this->view->neatline_exhibit = $exhibit;

        // Queue static assets.
        nl_queueNeatlineEditor($exhibit);

    }


    // Public views:
    // ------------------------------------------------------------------------


    /**
     * Show exhibit.
     */
    public function showAction()
    {

        $this->_helper->viewRenderer->setNoRender(true);

        // Try to find an exhibit with the requested slug.
        $exhibit = $this->_exhibits->findBySlug($this->_request->slug);
        if (!$exhibit) throw new Omeka_Controller_Exception_404;

        // Assign exhibit to view.
        $this->view->neatline_exhibit = $exhibit;

        // Queue static assets.
        nl_queueNeatlinePublic($exhibit);
        nl_queueExhibitTheme($exhibit);

        // Try to render exhibit-specific template.
        try { $this->render("themes/$exhibit->slug/show"); }
        catch (Exception $e) { $this->render('show'); }

    }


    /**
     * Show fullscreen exhibit.
     */
    public function fullscreenAction()
    {

        // Try to find an exhibit with the requested slug.
        $exhibit = $this->_exhibits->findBySlug($this->_request->slug);
        if (!$exhibit) throw new Omeka_Controller_Exception_404;

        // Assign exhibit to view.
        $this->view->neatline_exhibit = $exhibit;

        // Queue static assets.
        nl_queueNeatlinePublic($exhibit);
        nl_queueExhibitTheme($exhibit);
        nl_queueFullscreen($exhibit);

    }


    /**
     *
     */
    public function duplicateAction()
    {

        $exhibit = $this->_helper->db->findById();
        if (!$exhibit) throw new Omeka_Controller_Exception_404;

        $clone = clone $exhibit;
        $slugSuffix = 1;
        $newSlug = '';
        do {
          $newSlug = $clone->slug . '-' . $slugSuffix++;
        } while ($this->_exhibits->findBySlug($newSlug));
        $clone->slug = $newSlug;
        $clone->added = date('Y-m-d G:i:s');
        $clone->published = $clone->public ? date('Y-m-d G:i:s') : NULL;
        $titleSuffix = '';
        if (current_user()) {
          $clone->setOwner(current_user());
          $clone->owner_id = current_user()->id;
          $titleSuffix = __(' (%s copy)', current_user()->username);
        }
        else {
          $titleSuffix = __(' (Copy)');
        }
        $clone->title = $clone->title . $titleSuffix;
        $clone->save();

        Zend_Registry::get('job_dispatcher')->sendLongRunning(
            'Neatline_Job_DuplicateRecords', array(
                'exhibit_id'           => $exhibit->id,
                'adopting_exhibit_id'  => $clone->id,
                'owner_id'             => current_user() ? current_user()->id : NULL
            )
        );

        // Flash success.
        $this->_helper->flashMessenger(
            $this->_getDuplicateStartedMessage(), 'success'
        );

        // Redirect to browse.
        $this->_helper->redirector('browse');

    }


    // Helpers:
    // ------------------------------------------------------------------------


    /**
     * Return the pagination page length.
     *
     * Currently, $pluralName is ignored.
     */
    protected function _getBrowseRecordsPerPage($pluralName=null)
    {
        if (is_admin_theme()) return (int) get_option('per_page_admin');
        else return (int) get_option('per_page_public');
    }


    /**
     * Construct the details form.
     *
     * @param NeatlineExhibit $exhibit
     */
    protected function _getExhibitForm($exhibit)
    {
        return new Neatline_Form_Exhibit(array('exhibit' => $exhibit));
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
     * Set the duplication started message.
     */
    protected function _getDuplicateStartedMessage()
    {
        return __('The exhibit duplication was successfully started!');
    }


}
