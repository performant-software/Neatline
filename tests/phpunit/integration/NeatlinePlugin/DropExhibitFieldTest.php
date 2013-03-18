<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for `dropExhibitField` on `NeatlinePlugin`.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class NeatlinePluginTest_DropExhibitField extends Neatline_TestCase
{


    /**
     * `dropExhibitField` should add columns to the records table.
     */
    public function testDropExhibitField()
    {

        NeatlinePlugin::addExhibitField('test', 'INT UNSIGNED NULL');
        NeatlinePlugin::dropExhibitField('test');

        // Get columns.
        $cols = $this->db->describeTable(
          $this->__exhibits->getTableName()
        );

        // Should not have `test` column.
        $this->assertArrayNotHasKey('test', $cols);

    }


}
