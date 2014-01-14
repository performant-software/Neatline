<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
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
     * Get the database, call `migrate`.
     */
    public function __construct()
    {
        $this->db = get_db();
        $this->migrate();
    }


}
