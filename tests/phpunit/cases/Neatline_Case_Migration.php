<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class Neatline_Case_Migration extends Neatline_Case_Default
{


    /**
     * Install the 1.x schema.
     */
    public function setUp()
    {
        parent::setUp();
        $this->_create1xSchema();
    }


    /**
     * Restore the 2.x schema.
     */
    public function tearDown()
    {
        $this->_create2xSchema();
        parent::tearDown();
    }


    /**
     * Clear the existing 2.x schema.
     */
    protected function _clearSchema()
    {
        // TODO
    }


    /**
     * Install the 1.x schema.
     */
    protected function _create1xSchema()
    {
        $this->_clearSchema();
        // TODO
    }


    /**
     * Install the 2.x schema.
     */
    protected function _create2xSchema()
    {
        $this->_clearSchema();
        // TODO
    }


}
