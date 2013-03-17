<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `addRecordField` on `NeatlinePlugin`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_AddRecordField
    extends Neatline_Test_AppTestCase
{


    /**
     * `addRecordField` should add columns to the records table.
     */
    public function testAddRecordField()
    {

        NeatlinePlugin::addRecordField('test', 'INT UNSIGNED NULL');

        // Get columns.
        $cols = $this->db->describeTable(
          $this->__records->getTableName()
        );

        // Should have new `test` column.
        $this->assertArrayHasKey('test', $cols);
        $this->assertEquals($cols['test']['DATA_TYPE'], 'int');

    }


}
