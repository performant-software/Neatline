<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migration200Test_StartBackgroundJob extends Neatline_Case_Migration
{


    /**
     * When the plugin is upgraded, the background process to migrate the
     * data should be added to the queue.
     */
    public function testStartBackgroundJob()
    {

        $jobs = $this->db->select()
            ->from("{$this->db->prefix}processes")
            ->where("class='Omeka_Job_Process_Wrapper'")
            ->where("args LIKE '%Neatline_Job_UpgradeFrom1x%'")
            ->where("status='starting'")
            ->where("PID IS NULL")
            ->query()->fetchAll();

        $this->assertNotEmpty($jobs);

    }


}
