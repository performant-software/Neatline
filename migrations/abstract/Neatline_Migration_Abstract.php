<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

abstract class Neatline_Migration_Abstract
{


    protected $db;


    /**
     * Perform the migration.
     */
    abstract public function migrate();


    /**
     * Set a database connection, call `migrate`.
     */
    public function __construct()
    {
        $this->db = get_db();
        $this->migrate();
    }


    /**
     * Create a backup of the exhibits table.
     *
     * @param string $suffix A suffix for the copied table.
     */
    protected function _backupExhibitsTable($suffix)
    {
        $this->_backupTable("{$this->db->prefix}neatline_exhibits", $suffix);
    }


    /**
     * Create a backup of the records table.
     *
     * @param string $suffix A suffix for the copied table.
     */
    protected function _backupRecordsTable($suffix)
    {
        $this->_backupTable("{$this->db->prefix}neatline_records", $suffix);
    }


    /**
     * Duplicate a table.
     *
     * @param string $table The name of the table to duplicate.
     * @param string $suffix A suffix for the copied table.
     */
    protected function _backupTable($table, $suffix)
    {

        try {

            // Copy table.
            $this->db->query(<<<SQL
            CREATE TABLE {$table}_{$suffix} LIKE $table
SQL
);

            // Copy rows.
            $this->db->query(<<<SQL
            INSERT INTO {$table}_{$suffix} SELECT * FROM $table
SQL
);

        } catch (Exception $e) {}

    }


}
