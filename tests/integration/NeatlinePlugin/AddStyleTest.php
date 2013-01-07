<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * Tests for NeatlinePlugin::addStyle.
 *
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Neatline_NeatlinePluginTest_AddStyle
    extends Neatline_Test_AppTestCase
{


    /**
     * --------------------------------------------------------------------
     * addStyle() should add columns to record and tag tables..
     * --------------------------------------------------------------------
     */
    public function testAddStyle()
    {

        // Register a style.
        NeatlinePlugin::addStyle('test', 'INT UNSIGNED NULL');

        // Get columns.
        $recordCols = $this->db->describeTable(
            $this->db->prefix.'neatline_records');
        $tagCols = $this->db->describeTable(
            $this->db->prefix.'neatline_tags');

        // Check for record column.
        $this->assertArrayHasKey('test', $recordCols);
        $this->assertEquals($recordCols['test']['DATA_TYPE'], 'int');

        // Check for tag column
        $this->assertArrayHasKey('test', $tagCols);
        $this->assertEquals($tagCols['test']['DATA_TYPE'], 'tinyint');

    }


}
