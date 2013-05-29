<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_UpgradeJob extends Omeka_Job_AbstractJob
{

    public function perform()
    {
        $helper = new Neatline_Helper_Migration(null, $this->_db);
        $helper->migrateData();
    }

}

