<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4 cc=80; */

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2012 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class Migrate200Test_ProcessRecordCoverage
    extends Neatline_Case_Migration_200
{


    public function setUp()
    {

        parent::setUp();
        $this->_loadFixture('ProcessRecordCoverage.records');

        $this->_upgrade();
        $this->_migrate();

    }


    /**
     * If `geocoverage` is a single-feature WKT string, wrap it inside of a
     * `GEOMETRYCOLLECTION` and set it directly.
     */
    public function testSingleFeatureWKT()
    {
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 1))',
            $this->_getRecordByTitle('Single Feature WKT')->coverage
        );
    }


    /**
     * If `geocoverage` is a multi-feature WKT string, replace the old `|`
     * delimiter with `,` and wrap in a `GEOMETRYCOLLECTION`.
     */
    public function testMultiFeatureWKT()
    {
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 1),POINT(2 2))',
            $this->_getRecordByTitle('Multi Feature WKT')->coverage
        );
    }


    /**
     * If `geocoverage` is KML string, convert to WKT with geoPHP.
     */
    public function testRegularKML()
    {
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 1))',
            $this->_getRecordByTitle('Regular KML')->coverage
        );
    }


    /**
     * If `geocoverage` is a collection of points/lines/polygons, geoPHP
     * should convert to `GEOMETRYCOLLECTION`, not `MULTI`-XX, which can't be
     * indexed in MySQL.
     */
    public function testMultiFeatureKML()
    {
        $this->assertEquals(
            'GEOMETRYCOLLECTION(POINT(1 1),POINT(2 2))',
            $this->_getRecordByTitle('Multi Feature KML')->coverage
        );
    }


    /**
     * If a record has a `geocoverage` but is not active on the map, the
     * coverage should not be migrated.
     */
    public function testMapInactive()
    {
        $this->assertNull(
            $this->_getRecordByTitle('Map Inactive')->coverage
        );
    }


}
