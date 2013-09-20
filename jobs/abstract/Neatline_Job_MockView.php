<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

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
        nl_mountView(); // Mount the view script hierarchy.
        nl_setWebDir($this->_options['web_dir']); // Inject the web-root.
        $this->execute();
    }


    /**
     * Run the job.
     */
    abstract protected function execute();


}
