<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Item import job.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class ItemImporter extends Omeka_Job_AbstractJob
{


    /**
     * Import Omeka items.
     */
    public function perform()
    {
        print_r($this->_options);
    }


}
