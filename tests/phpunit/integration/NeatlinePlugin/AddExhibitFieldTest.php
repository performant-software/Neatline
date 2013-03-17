<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `addExhibitField` on `NeatlinePlugin`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_AddExhibitField
    extends Neatline_Test_AppTestCase
{


    /**
     * `addExhibitField` should add columns to the records table.
     */
    public function testAddExhibitField()
    {

        NeatlinePlugin::addExhibitField('test', 'INT UNSIGNED NULL');

        // Get columns.
        $cols = $this->db->describeTable(
          $this->__exhibits->getTableName()
        );

        // Should have new `test` column.
        $this->assertArrayHasKey('test', $cols);
        $this->assertEquals($cols['test']['DATA_TYPE'], 'int');

    }


}
