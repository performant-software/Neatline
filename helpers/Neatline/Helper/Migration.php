<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_Helper_Migration
{

    /**
     * The NeatlinePlugin
     *
     * @var NeatlinePlugin
     **/
    protected $_plugin;

    /**
     * This is the database.
     *
     * @var Omeka_Db
     **/
    protected $_db;

    public function __construct($plugin, $db)
    {
        $this->_plugin = $plugin;
        $this->_db     = $db;
    }

    /**
     * This controls migrating the data.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function migrate()
    {
        $this->backupTables();
        $this->installTables();
        $this->queueJob();
    }

    /**
     * This backs up the old the database tables.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function backupTables()
    {
        $db     = $this->_db;
        $prefix = "{$db->prefix}neatline_";
        $ext    = "_migrate";

        $db->query("ALTER TABLE {$prefix}exhibits     RENAME TO {$prefix}exhibits{$ext};");
        $db->query("ALTER TABLE {$prefix}data_records RENAME TO {$prefix}data_records{$ext};");
        $db->query("ALTER TABLE {$prefix}base_layers  RENAME TO {$prefix}base_layers{$ext};");
    }

    /**
     * This installs the new (v2) tables.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function installTables()
    {
        $this->_plugin->hookInstall();
    }

    /**
     * This queues the background job to migrate the data.
     *
     * @return void
     * @author Eric Rochester
     **/
    public function queueJob()
    {
        Zend_Registry::get('job_dispatcher')->sendLongRunning(
            'Neatline_UpgradeJob', array(
                'web_dir'       => nl_getWebDir()
            )
        );
    }

    /**
     * This migrates the data from the old (v1) databases to the new (v2).
     *
     * @return void
     * @author Eric Rochester
     **/
    public function migrateData()
    {
    }

}

