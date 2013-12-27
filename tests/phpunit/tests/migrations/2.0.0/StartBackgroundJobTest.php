<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_StartBackgroundJob extends Neatline_Case_Migrate
{


    /**
     * When the plugin is upgraded, the background process to migrate the data
     * should be added to the queue.
     */
    public function testStartBackgroundJob()
    {

        $jobs = $this->_mockJobDispatcher();

        // Should dispatch `Neatline_Job_UpgradeFrom1x`.
        $jobs->expects($this->once())->method('sendLongRunning')->with(
            'Neatline_Job_UpgradeFrom1x'
        );

        $this->_upgrade();

    }


}
