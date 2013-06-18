<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class v20alpha1_v20alpha2Test_Migrate extends Neatline_Case_Default
{


    /**
     * Restore the 2.0-alpha1 schema, migrate to 2.0-alphpa2.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_clearSchema();
        $this->_createSchema1();
        $this->_migrate();
    }


    /**
     * Drop all Neatline tables.
     */
    private function _clearSchema()
    {
        // TODO
    }


    /**
     * Install 2.0-alpha1 schema.
     */
    private function _createSchema1()
    {
        // TODO
    }


    /**
     * Run 2.0-alpha1 -> 2.0-alpha2 migration.
     */
    private function _migrate()
    {
        // TODO
    }


}
