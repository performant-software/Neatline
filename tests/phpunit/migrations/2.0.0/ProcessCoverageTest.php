<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=76; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessCoverage extends Neatline_Case_Migrate200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessCoverage.records.json');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If `geocoverage` on the old table is in WKT format, split on the
     * `|` delimiter and wrap the features in a `GEOMETRYCOLLECTION`.
     */
    public function testWKTtoWKT()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('WKT')->coverage,
            'GEOMETRYCOLLECTION(POINT(1 1),POINT(2 2))'
        );
    }


    /**
     * If `geocoverage` on the old table is in KML format, convert to WKT
     * with the geoPHP library.
     */
    public function testKMLtoWKT()
    {
        $this->assertEquals(
            $this->_getRecordByTitle('KML')->coverage,
            'GEOMETRYCOLLECTION(POINT(1 1),POINT(2 2))'
        );
    }


}
