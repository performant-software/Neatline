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


    protected $_plugin;
    protected $_db;


    /**
     * Store plugin and database, call `migrate`.
     *
     * @param $plugin NeatlinePlugin The plugin manager class.
     * @param $db Omeka_Db The database connection.
     */
    public function __construct($plugin, $db)
    {
        $this->_plugin = $plugin;
        $this->_db = $db;
        $this->migrate();
    }


    /**
     * Perform the migration.
     */
    abstract public function migrate();


}
