<?php
/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4; */

/**
 * Admin controller.
 *
 * PHP version 5
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by
 * applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * @package     omeka
 * @subpackage  neatline
 * @author      Scholars' Lab <>
 * @author      Bethany Nowviskie <bethany@virginia.edu>
 * @author      Adam Soroka <ajs6f@virginia.edu>
 * @author      David McClure <david.mcclure@virginia.edu>
 * @copyright   2011 The Board and Visitors of the University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html Apache 2 License
 */

class Neatline_IndexController extends Omeka_Controller_Action
{

    /**
     * Get table objects.
     *
     * @return void
     */
    public function init()
    {

        $this->_neatlinesTable = $this->getTable('NeatlineExhibit');
        $this->_mapsTable = $this->getTable('NeatlineMapsMap');

    }

    /**
     * Redirect index route to browse.
     *
     * @return void
     */
    public function indexAction()
    {

        $this->_redirect('neatline-exhibits/browse');

    }

    /**
     * Show list of existing Neatlines.
     *
     * @return void
     */
    public function browseAction()
    {

        $sortField =    $this->_request->getParam('sort_field');
        $sortDir =      $this->_request->getParam('sort_dir');
        $page =         $this->_request->page;

        // Push pagination variables.
        $this->view->pagination = $this->_neatlinesTable
            ->getPaginationSettings($page);

        // Push Neatlines.
        $this->view->neatlines = $this->_neatlinesTable
            ->getNeatlinesForBrowse($sortField, $sortDir, $page);

    }

    /**
     * Create a new exhibit.
     *
     * @return void
     */
    public function addAction()
    {

        // Construct the form.
        $form = new AddExhibitForm;

        // Try to create the Neatline if the form has been submitted.
        if ($this->_request->isPost()) {

            // If no errors, save form and redirect.
            if ($form->isValid($this->_request->getPost())) {

                // Get values and create new exhibit.
                $values = $form->getValues();

                // Create exhibit and apply values.
                $exhibit = new NeatlineExhibit;
                $exhibit->saveForm(
                    $values['title'],
                    $values['slug'],
                    $values['public'],
                    $values['baselayer'],
                    $values['map'],
                    $values['image']
                );

                // Commit.
                $exhibit->save();

                return $this->_redirect('neatline-exhibits');

            }

        }

        // Push Neatline object into view.
        $this->view->form = $form;

    }

    /**
     * Edit an exhibit.
     *
     * @return void
     */
    public function editAction()
    {

        // Get the exhibit.
        $exhibit = $this->_neatlinesTable->findBySlug($this->_request->slug);

        // Construct the form.
        $form = new EditExhibitForm();
        $form->setExhibit($exhibit);

        // Populate the form.
        $form->populate(array(
            'title' => $exhibit->name,
            'slug' => $exhibit->slug,
            'public' => $exhibit->public
        ));

        // Try to edit if the form has been submitted.
        if ($this->_request->isPost()) {

            // If no errors, save form and redirect.
            if ($form->isValid($this->_request->getPost())) {

                // Capture values.
                $values = $form->getValues();

                // Apply values.
                $exhibit->name = $values['title'];
                $exhibit->slug = $values['slug'];
                $exhibit->public = (int) $values['public'];

                // Commit.
                $exhibit->save();

                return $this->_redirect('neatline-exhibits');

            }

        }

        // Push exhibit and form into view.
        $this->view->exhibit = $exhibit;
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
        $exhibit = $this->_neatlinesTable->findBySlug($this->_request->slug);

        if(isset($_GET['search'])) {
            $exhibit->query = serialize($_GET);
            $exhibit->save();
            $this->redirect->goto('browse');
        } else {
            $queryArray = unserialize($exhibit->query);
            $_GET = $queryArray;
            $_REQUEST = $queryArray;
        }

    }

    /**
     * Delete exhibits.
     *
     * @return void
     */
    public function deleteAction()
    {

        $_post = $this->_request->getPost();
        $id = $this->_request->getParam('id');
        $neatline = $this->_neatlinesTable->find($id);
        $this->view->neatline = $neatline;

        // If the delete is confirmed.
        if (isset($_post['confirmed'])) {

            // Delete and redirect.
            $neatline->delete();
            $this->flashSuccess(neatline_deleteSucceed($neatline->name));
            $this->_redirect('neatline-exhibits');

        }

    }

}
