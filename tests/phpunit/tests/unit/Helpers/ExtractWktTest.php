<?php

/**
 * @package     omeka
 * @subpackage  neatline
 * @copyright   2014 Rector and Board of Visitors, University of Virginia
 * @license     http://www.apache.org/licenses/LICENSE-2.0.html
 */

class HelpersTest_ExtractWkt extends Neatline_Case_Default
{


    /**
     * `nl_extractWkt` should allow an existing WKT value.
     */
    public function testExtractValueWKT()
    {
        $this->assertNotNull(nl_extractWkt('POINT (13 42)'));
    }


    /**
     * `nl_extractWkt` should return null for a non-WKT value.
     */
    public function testIgnoreNonWKT()
    {
        $this->assertNull(nl_extractWkt('Paris'));
    }


}
