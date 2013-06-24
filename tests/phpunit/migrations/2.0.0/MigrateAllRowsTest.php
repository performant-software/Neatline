<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_MigrateAllRows extends Neatline_Case_Migrate200
{


    /**
     * All exhibit and record rows should be moved to the new tables.
     */
    public function tearDown()
    {

        $this->_upgrade();
        $this->_migrate();

        // EXHIBIT
        $c1 = $this->_countRows('neatline_exhibits_migrate');
        $c2 = $this->_countRows('neatline_exhibits');
        $this->assertEquals($c1, $c2);

        // RECORDS
        $c1 = $this->_countRows('neatline_data_records_migrate');
        $c2 = $this->_countRows('neatline_records');
        $this->assertEquals($c1, $c2);

        parent::tearDown();

    }


    public function testHotchkiss()
    {
        $this->_loadFixture('Hotchkiss.exhibits.json');
        $this->_loadFixture('Hotchkiss.records.json');
    }


}
