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
?>

<?php

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
     * Create a new Neatline.
     *
     * @return void
     */
    public function addAction()
    {

        $neatline = new NeatlineExhibit;

        // Try to create the Neatline if the form has been submitted.
        if ($this->_request->isPost()) {

            // Gather post.
            $_post = $this->_request->getPost();
            $title = $_post['title'];
            $map = $_post['map'];

            // Validate.
            $errors = $neatline->validateForm($title);

            // If no errors, save form and redirect.
            if (count($errors) == 0) {

                if ($neatline->saveForm($title, $map)) {
                    $this->_redirect('neatline-exhibits');
                }

                else {
                    $this->flashError(neatline_saveFail($neatline->name));
                }

            }

            else {
                $neatline->populateData($_post);
                $this->view->errors = $errors;
            }

        }

        // Bounce back if there are no maps or no timelines.
        if ($this->_mapsTable->count() == 0 &&
            $this->_timelinesTable->count() == 0) {

            $this->flashError(neatline_noMapsOrTimelinesErrorMessage());
            $this->_redirect('neatline-exhibits');

        }

        // Push Neatline object into view.
        $this->view->neatline = $neatline;

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
