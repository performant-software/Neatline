<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `dropRecordField` on `NeatlinePlugin`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_DropRecordField
    extends Neatline_Test_AppTestCase
{


    /**
     * `dropRecordField` should add columns to the records table.
     */
    public function testDropRecordField()
    {

        NeatlinePlugin::addRecordField('test', 'INT UNSIGNED NULL');
        NeatlinePlugin::dropRecordField('test');

        // Get columns.
        $cols = $this->db->describeTable(
          $this->__records->getTableName()
        );

        // Should not have `test` column.
        $this->assertArrayNotHasKey('test', $cols);

    }


}
