<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for functionality in the plugin manager class.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */


class NeatlinePluginTest extends Neatline_Test_AppTestCase
{


    /**
     * Set up the helper class, plugin, etc.
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function setUp()
    {
        parent::setUp();

        $this->db = get_db();
        $this->_dataTable = $this->db->getTable('NeatlineRecord');
    }


    /**
     * This tests the before_delete_record hook.
     * @author Eric Rochester <erochest@virginia.edu>
     **/
    public function testBeforeDeleteRecord()
    {

        $item     = $this->__item();
        $neatline = $this->__exhibit();
        $record   = new NeatlineRecord($item, $neatline);
        $record->save();

        $item->delete();

        $r2 = $this->_dataTable->find($record->id);
        $this->assertNull($r2);

    }


}
