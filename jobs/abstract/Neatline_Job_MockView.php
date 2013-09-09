<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


abstract class Neatline_Job_MockView extends Omeka_Job_AbstractJob
{


    /**
     * Mock the view.
     */
    public function perform()
    {

        // Since this code isn't running in the context of a regular web
        // request, the hierarchy of view template directories hasn't been
        // set up by the controller. In order for the item compilation to
        // work properly, we need to create new instance of `Omeka_View`,
        // set it in the registry, and manually register the directories
        // where the view should search for template files - first in the
        // theme, then in the Neatline plugin, then in the Omeka core.

        nl_mountView();

        // Manually set the base web directory passed from the controller
        // action. This ensures that links to file attachments will point
        // to the web-accessible locations, not to the local filesystem.

        nl_setWebDir($this->_options['web_dir']);

        $this->execute();

    }


    /**
     * Run the job.
     */
    abstract protected function execute();


}
