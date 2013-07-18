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


    /**
     * Change an existing column's type.
     *
     * @param string $name The name of the column to be changed.
     * @param string $type The new type for the column.
     */
    private function _changeColumnType($name, $type)
    {
        // TODO
    }


    /**
     * Change an existing column's name.
     *
     * @param string $oldName The name of the column to be changed.
     * @param string $newName The new name for the column.
     */
    private function _changeColumnName($oldName, $newName)
    {
        // TODO
    }


    /**
     * Add a new column.
     *
     * @param string $name The column name.
     * @param string $type The column type.
     */
    private function _addColumn($name, $type)
    {
        // TODO
    }


}
