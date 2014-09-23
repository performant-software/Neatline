<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_GetWkt extends Neatline_Case_Default
{


    const KML = <<<KML
    <kml xmlns="http://earth.google.com/kml/2.0">
        <Folder>
            <Placemark>
                <Point><coordinates>1,2</coordinates></Point>
            </Placemark>
        </Folder>
    </kml>
KML;


    /**
     * If a WKT string is passed, it should be returned unchanged.
     */
    public function testReturnWkt()
    {
        $this->assertEquals(
            'POINT(1 2)',
            nl_getWkt('POINT(1 2)')
        );
    }


    /**
     * If a KML document is passed, it should be converted to WKT.
     */
    public function testConvertKml()
    {
        $this->assertEquals(
            geoPHP::load('POINT(1 2)')->out('wkt'),
            nl_getWkt(self::KML)
        );
    }


    /**
     * If the passed value is neither WKT nor KML, return null.
     */
    public function testIgnoreInvalid()
    {
        $this->assertNull(nl_getWkt('Paris'));
    }


}
