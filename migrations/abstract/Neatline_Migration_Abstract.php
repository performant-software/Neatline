<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Migration_Abstract
{


    protected $plugin;
    protected $db;


    /**
     * Perform the migration.
     */
    abstract public function migrate();


    /**
     * Store plugin and database, call `migrate`.
     *
     * @param NeatlinePlugin $plugin The plugin manager class.
     * @param $db Omeka_Db $db The database connection.
     * @param boolean $start If true, start migration automatically.
     */
    public function __construct($plugin, $db, $start=true)
    {

        $this->plugin = $plugin;
        $this->db = $db;

        if ($start) $this->migrate();

    }


}
